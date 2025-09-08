import Student from "../models/Student.js";
import AuditLog from "../models/AuditLogs.js";
import fs from "fs";
import { Op, Sequelize } from "sequelize";
import ExcelJS from "exceljs";
import xlsx from "xlsx";
import path from "path";
import sequelize from "../config/db.js";

// Utility: Safe delete for images
const safeUnlink = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
};

// ✅ Add student
export const addStudent = async (req, res) => {
  try {
    const { name, age, grade, section, gender } = req.body;
    const image = req.file ? req.file.filename : null;

    const student = await Student.create({ name, age, grade, section, gender, image });

    await AuditLog.create({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      studentId: student.id,
      action: "CREATE",
      changes: { after: student.toJSON() },
    });

    res.json({ msg: "Student added successfully", student });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// ✅ Get students (pagination + search + filter)
export const getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", gradeFilter = "", sectionFilter = "" } = req.query;

    const where = {};

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (gradeFilter) where.grade = { [Op.iLike]: gradeFilter.trim() };
    if (sectionFilter) where.section = { [Op.iLike]: sectionFilter.trim() };

    const _limit = +limit;
    const _page = +page;
    const offset = (_page - 1) * _limit;

    const { count, rows } = await Student.findAndCountAll({
      where,
      limit: _limit,
      offset,
      order: [["id", "ASC"]],
    });

    res.json({
      total: count,
      students: rows,
      page: _page,
      totalPages: Math.ceil(count / _limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err.message });
  }
};

// ✅ Update student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    const oldData = student.toJSON();
    const { name, age, grade, section, gender } = req.body;

    if (name) student.name = name;
    if (age) student.age = age;
    if (grade) student.grade = grade;
    if (section) student.section = section;
    if (gender) student.gender = gender;

    if (req.file) {
      if (student.image) {
        const oldPath = path.join("uploads", student.image);
        safeUnlink(oldPath);
      }
      student.image = req.file.filename;
    }

    await student.save();

    await AuditLog.create({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      studentId: student.id,
      action: "UPDATE",
      changes: { before: oldData, after: student.toJSON() },
    });

    res.json({ msg: "Student updated successfully", student });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// ✅ Delete student
export const deleteStudent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const student = await Student.findByPk(req.params.id, { transaction: t });
    if (!student) {
      await t.rollback();
      return res.status(404).json({ msg: "Student not found" });
    }

    if (student.image) safeUnlink(path.join("uploads", student.image));

    await AuditLog.create(
      {
        userId: req.user.id,
        userName: req.user.name,
        userRole: req.user.role,
        studentId: student.id,
        action: "DELETE",
        changes: { before: student.toJSON() },
      },
      { transaction: t }
    );

    await student.destroy({ transaction: t });

    await t.commit();
    res.json({ msg: "Student deleted successfully" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ err: err.message });
  }
};

// ✅ Export students to Excel
export const exportStudents = async (req, res) => {
  try {
    const students = await Student.findAll({ order: [["id", "ASC"]] });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Students");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Age", key: "age", width: 10 },
      { header: "Grade", key: "grade", width: 10 },
      { header: "Section", key: "section", width: 10 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Image", key: "image", width: 30 },
    ];

    students.forEach((s, index) => {
      worksheet.addRow({
        id: index + 1,
        name: s.name,
        age: s.age,
        grade: s.grade,
        section: s.section,
        gender: s.gender,
        image: s.image,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// ✅ Import students from Excel
export const importStudents = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let inserted = 0,
      skipped = 0,
      errors = [];

    for (let row of rows) {
      const name = (row.Name || row.name || "").toString().trim();
      const age = Number(row.Age || row.age);
      const grade = (row.Grade || row.grade).toString().trim();
      const section = (row.Section || row.section || "").toString().trim().toUpperCase();
      const gender = (row.Gender || row.gender || "").toString().trim();

      if (!name || !age || !grade || !section || !gender) {
        errors.push({ row, reason: "Missing required fields" });
        skipped++;
        continue;
      }

      const duplicate = await Student.findOne({
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), name.toLowerCase()),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("grade")), grade.toLowerCase()),
            Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("section")), section.toLowerCase()),
          ],
        },
      });

      if (duplicate) {
        skipped++;
        errors.push({ row, reason: "Duplicate entry" });
        continue;
      }

      await Student.create({ name, age, grade, section, gender });
      inserted++;
    }

    res.json({ msg: "Import finished", inserted, skipped, errors });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ msg: "Import failed", error: err.message });
  }
};

// ✅ Get grades + sections
export const getAllGradesSections = async (req, res) => {
  try {
    const gradesRaw = await Student.findAll({
      attributes: ["grade", [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
      group: ["grade"],
      raw: true,
    });

    const sectionsRaw = await Student.findAll({
      attributes: ["section", [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
      group: ["section"],
      raw: true,
    });

    const grades = gradesRaw.map((g) => g.grade);
    const sections = sectionsRaw.map((s) => s.section);

    res.json({ grades, sections });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// ✅ Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Student.count();

    const perGradeRaw = await Student.findAll({
      attributes: ["grade", [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
      group: ["grade"],
      raw: true,
    });

    const perGrade = perGradeRaw.map((r) => ({
      grade: r.grade,
      count: parseInt(r.count, 10),
    }));

    const genderRaw = await Student.findAll({
      attributes: ["gender", [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
      group: ["gender"],
      raw: true,
    });

    const genderRatio = genderRaw.map((r) => ({
      gender: r.gender,
      count: parseInt(r.count, 10),
    }));

    res.json({ total, perGrade, genderRatio });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ err: err.message });
  }
};
