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
      .select('fullName mobile medicalDocument licenseStatus');
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
    if (!doctor || !doctor.medicalDocument) {
      return res.status(404).send('Document not found');
    }
    res.set('Content-Type', doctor.medicalDocument.contentType);
    res.send(doctor.medicalDocument.data);
  } catch (error) {
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
