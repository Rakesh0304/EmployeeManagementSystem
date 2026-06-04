const Salary = require('../models/Salary');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const PDFDocument = require('pdfkit');

const calculateSalary = async (req, res) => {
  try {
    const { month, user_id } = req.body; // YYYY-MM
    const query = { role: { $ne: 'admin' }, is_active: true };
    if (user_id) query._id = user_id;
    
    const employees = await User.find(query);
    console.log(`[Salary] Calculating for ${employees.length} employees in month ${month}`);

    const simTime = req.headers['x-simulated-time'];
    const now = simTime ? new Date(simTime) : new Date();
    
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const isCurrentMonth = month === currentYearMonth;
    const todayNum = now.getDate();
    console.log(`[Salary] Calculation focused on Simulated Date: ${now.toDateString()}`);
    
    // Determine how many days have passed in the month for absence calculation
    const passedDays = isCurrentMonth ? todayNum : 30; // Use 30 for past months

    for (const emp of employees) {
      const attendance = await Attendance.find({ 
        user_id: emp._id, 
        date: { $regex: new RegExp(`^${month}`) } 
      });

      console.log(`[Salary Debug] ${emp.name}: Found ${attendance.length} records for ${month}`);
      attendance.forEach(a => console.log(`  - ${a.date}: status=${a.status}`));

      const stats = {
        present: attendance.filter(a => a.status === 'present').length,
        late: attendance.filter(a => a.status === 'late').length,
        half: attendance.filter(a => a.status === 'half_day').length,
        explicit_lop: attendance.filter(a => a.status === 'lop' || a.status === 'absent').length
      };

      const totalWorkDaysInMonth = 26; 
      const attendedDaysForDisplay = stats.present + stats.late + (stats.half * 0.5);
      
      // Simplify logic: Only deduct for explicit LOP or if manually marked
      const stats_lop = stats.explicit_lop;

      const dailyRate = emp.basic_salary / totalWorkDaysInMonth;
      const lateDeduction = stats.late * (dailyRate * 0.1); 
      const halfDayDeduction = stats.half * (dailyRate * 0.5);
      const lopDeduction = stats_lop * dailyRate; 
      
      const totalDeductions = lateDeduction + halfDayDeduction + lopDeduction;
      const netSalary = emp.basic_salary - totalDeductions;

      console.log(`[Salary Debug] ${emp.name}: PresentDays=${attendedDaysForDisplay}, Deductions=${totalDeductions}, Net=${netSalary}`);

      await Salary.findOneAndUpdate(
        { user_id: emp._id, month },
        {
          basic_salary: emp.basic_salary,
          working_days: totalWorkDaysInMonth,
          present_days: attendedDaysForDisplay,
          late_days: stats.late,
          half_days: stats.half,
          lop_days: stats_lop,
          absent_days: stats_lop,
          late_deduction: lateDeduction,
          half_day_deduction: halfDayDeduction,
          lop_deduction: lopDeduction,
          total_deductions: totalDeductions,
          net_salary: netSalary > 0 ? netSalary : 0
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Salary calculated successfully' });
  } catch (error) {
    console.error('[Salary Error]', error);
    res.status(500).json({ message: error.message });
  }
};

const getSalary = async (req, res) => {
  try {
    const { month } = req.query;
    const salaries = await Salary.find({ month }).populate('user_id', 'name');
    const mapped = salaries.map(s => ({
      ...s._doc,
      name: s.user_id?.name
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySalary = async (req, res) => {
  try {
    const salaries = await Salary.find({ user_id: req.user.id }).sort({ month: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadPayslip = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate('user_id', 'name email designation department');
    if (!salary) return res.status(404).send('Salary record not found');

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payslip_${salary.month}.pdf`);

    doc.pipe(res);
    doc.fillColor('#003366').font('Helvetica-Bold').fontSize(20).text('PAYSLIP', { align: 'center' });
    doc.moveDown();
    doc.fillColor('black').font('Helvetica').fontSize(12).text(`Employee Name: ${salary.user_id.name}`);
    doc.text(`Designation: ${salary.user_id.designation}`);
    doc.text(`Department: ${salary.user_id.department}`);
    doc.text(`Month: ${salary.month}`);
    doc.moveDown();
    doc.fillColor('#003366').text('------------------------------------------');
    doc.fillColor('black').text(`Basic Salary: Rs. ${salary.basic_salary}`);
    doc.text(`Late Deductions: Rs. ${salary.late_deduction.toFixed(2)}`);
    doc.text(`Half-Day Deductions: Rs. ${salary.half_day_deduction.toFixed(2)}`);
    doc.text(`LOP Deductions: Rs. ${salary.lop_deduction.toFixed(2)}`);
    doc.fillColor('#003366').text('------------------------------------------');
    doc.fillColor('#006400').font('Helvetica-Bold').fontSize(14).text(`Net Salary: Rs. ${salary.net_salary.toFixed(2)}`);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { calculateSalary, getSalary, getMySalary, downloadPayslip };
