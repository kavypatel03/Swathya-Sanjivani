const Admin = require('../models/admin.model');
const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const Document = require('../models/documents.model');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const admin = await Admin.findOne({ mobile });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = admin.generateAuthToken();
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.redirect('/admin/dashboard');
  } catch (error) {
    res.status(500).render('login', { error: 'Login failed' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      patientCount: await Patient.countDocuments(),
      doctorCount: await Doctor.countDocuments(),
      documentCount: await Document.countDocuments(),
      pendingDoctors: await Doctor.countDocuments({ licenseStatus: 'Pending' })
    };
    res.render('admin', { stats });
  } catch (error) {
    res.status(500).send('Error fetching stats');
  }
};

exports.getDoctorVerifications = async (req, res) => {
  try {
    const doctors = await Doctor.find({ licenseStatus: 'Pending' })
      .select('fullName mobile medicalDocuments licenseStatus specialization createdAt');
    res.render('doctor', { doctors });
  } catch (error) {
    res.status(500).send('Error fetching doctors');
  }
};

exports.updateDoctorStatus = async (req, res) => {
  try {
    const { doctorId, status } = req.params;
    await Doctor.findByIdAndUpdate(doctorId, { licenseStatus: status });
    res.redirect('/admin/doctor-verifications');
  } catch (error) {
    res.status(500).send('Error updating doctor status');
  }
};

exports.viewDoctorDocument = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    
    // Check if doctor exists and has at least one medical document
    if (!doctor || !doctor.medicalDocuments || doctor.medicalDocuments.length === 0) {
      return res.status(404).send('Document not found');
    }
    
    // Get the first document (you might want to handle multiple documents differently)
    const document = doctor.medicalDocuments[0];
    
    res.set('Content-Type', document.contentType);
    res.send(document.data);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).send('Error fetching document');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select('fullname email mobile family')
      .lean();

    // Transform data to include main user and family members
    const allUsers = patients.flatMap(patient => {
      const users = [{
        _id: patient._id,
        fullName: patient.fullname,
        email: patient.email,
        mobile: patient.mobile,
        relation: 'Self'
      }];
      
      // Add family members if they exist
      if (patient.family && patient.family.length > 0) {
        const familyMembers = patient.family.map(member => ({
          _id: member._id,
          fullName: member.fullName,
          relation: member.relationWithMainPerson,
          mainUserMobile: patient.mobile // Adding main user's mobile for reference
        }));
        users.push(...familyMembers);
      }
      
      return users;
    });

    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await Patient.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select('fullName email mobile licenseStatus')
      .lean();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};
exports.deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // 1. First remove doctor from all patients' doctors array
    await Patient.updateMany(
      { doctors: doctorId },
      { $pull: { doctors: doctorId } }
    );

    // 2. Then delete the doctor
    await Doctor.findByIdAndDelete(doctorId);

    // 3. Optional: Delete any documents uploaded by this doctor
    await Document.deleteMany({ uploadedBy: doctorId });

    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete doctor',
      error: error.message 
    });
  }
};