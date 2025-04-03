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

//? add data
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

// validate data
exports.checklogin = async (req, res) => {
  try {
    const result = await prisma.userTB.findFirst({
      where: {
        userName: req.params.userName,
        userPassword: req.params.userPassword        
      }
    })

    if (result) {
      res.status(200).json({
        message: "เข้าสู่ระบบสําเร็จ",
        data: result
      })
    } else {
      res.status(404).json({
        message: "ไม่พบข้อมูล"
      })
    }
  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`
    })
  }
    }

//update
exports.updateUser = async (request, response) => {
  try {
    let result = {};
    
    if (request.file) {
     
      const userResult = await prisma.userTB.findFirst({
        where: {
          userId: parseInt(request.params.userId),
        },
      });
      //เอาข้อมูลของ user ที่ได้มามาดูว่ามีรูปไหม ถ้ามีให้ลบรูปนั้นทิ้ง
      if (userResult.userImage) {
        fs.unlinkSync(path.join("images/users", userResult.userImage)); //ลบรูปทิ้ง
      }
      //แก้ไขข้อมูลในฐานข้อมูล
      result = await prisma.userTB.update({
        where: {
          userId: parseInt(request.params.userId),
        },
        data: {
          userFullname: request.body.userFullname,
          userName: request.body.userName,
          userPassword: request.body.userPassword,
          userImage: request.file.path.replace("images\\users\\", ""),
        },
      });
    } else {
      //แก้ไขข้อมูลแบบไม่มีการแก้ไขรูป
      result = await prisma.userTB.update({
        where: {
          userId: parseInt(request.params.userId),
        },
        data: {
          userFullname: request.body.userFullname,
          userName: request.body.userName,
          userPassword: request.body.userPassword,
        },
      });
    }
    //-----
    response.status(200).json({
      message: "Ok",
      info: result,
    });
  } catch (error) {
    response.status(500).json({
      message: `พบปัญหาในการทำงาน: ${error}`,
    });
    console.log(`Error: ${error}`);
  }
};

exports.deleteUser = async (req,res) => {
  try {
    const result = await prisma.userTB.delete({
      where: {
        userId: parseInt(req.params.userId),
      },
    });
    res.status(200).json({
      message: "ลบข้อมูลสําเร็จ",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`,
    });
    console.log('Error', err);
  }
};