const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//? สร้างตัวแปรอ้างอิงสำหรับ prisma เพื่อเอาไปใช้
const prisma = new PrismaClient();

//? อัปโหลดไฟล์-----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users");
  },
  filename: (req, file, cb) => {
    cb(null, 'user_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
  }
})
exports.uploadUser = multer({
  storage: storage,
  limits: {
    fileSize: 1000000 //? file 1 mb
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Error: Images Only");
  }
}).single("userImage");//? ต้องตรงกับ column ในฐานข้อมูล
//?-------------------------------------------------

//? การเอาข้อมูลที่ส่งมาจาก Frontend เพิ่ม(Create/Insert) ลงตารางใน DB
exports.createUser = async (req, res) => {
  try {
    const { userFullname, userName, userPassword } = req.body
    const result = await prisma.userTB.create({
      data: {
        userFullname: userFullname,
        userName: userName,
        userPassword: userPassword,
        userImage: req.file ? req.file.path.replace("images\\users\\", '') : "",
      }
    })

    res.status(201).json({
      message: "เพิ่มข้อมูลสําเร็จ",
      data: result
    })
  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`
    })
    console.log('Error', err);
  }
}
//?-------------------------------------------------