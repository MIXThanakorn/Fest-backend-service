const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//? สร้างตัวแปรอ้างอิงสำหรับ prisma เพื่อเอาไปใช้
const prisma = new PrismaClient();

//? อัปโหลดไฟล์-----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/fests");
  },
  filename: (req, file, cb) => {
    cb(null, 'fest_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
  }
})
exports.uploadFest = multer({
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
}).single("festImage");//? ต้องตรงกับ column ในฐานข้อมูล
//?-------------------------------------------------

//? การเอาข้อมูลที่ส่งมาจาก Frontend เพิ่ม(Create/Insert) ลงตารางใน DB
exports.createFest = async (req, res) => {
  try {
    const { festName,festDetail,festState,festCost,userId,festImage,festNumDay } = req.body; 
    const result = await prisma.festTB.create({
      data: {
        festName: festName,
        festDetail: festDetail,
        festState: festState,
        festCost: parseFloat(festCost),
        userId:parseInt(userId),
        festNumDay:parseInt(festNumDay),
        festImage:req.file ? req.file.path.replace("images\\fests\\", '') : "",
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

exports.getAllFestbyuser = async (req, res) => {
  try {
    const result = await prisma.festTB.findMany({
      where: {
        userId: parseInt(req.params.userId),
      },
    });
    res.status(200).json({
      message: "ดึงข้อมูลสําเร็จ",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`,
    });
    console.log('Error', err);
  }
};

exports.getOnlyFest = async (req, res) => {
  try {
    const result = await prisma.festTB.findMany({
      where: {
        festId: parseInt(req.params.festId),
      },
    });
    res.status(200).json({
      message: "ดึงข้อมูลสําเร็จ",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      message: `พบเจอปัญหาในการทำงาน: ${err}`,
    });
    console.log('Error', err);
  }
};

exports.updateFest = async (request, response) => {
  try {
    let result = {};
    
    if (request.file) {
     
      const festResult = await prisma.festTB.findFirst({
        where: {
          festId: parseInt(request.params.festId),
        },
      });
      //เอาข้อมูลของ user ที่ได้มามาดูว่ามีรูปไหม ถ้ามีให้ลบรูปนั้นทิ้ง
      if (festResult.festImage) {
        fs.unlinkSync(path.join("images/users", festResult.festImage)); //ลบรูปทิ้ง
      }
      //แก้ไขข้อมูลในฐานข้อมูล
      result = await prisma.festTB.update({
        where: {
          festId: parseInt(request.params.festId),
        },
        data: {
        festName: request.body.festName,
        festDetail: request.body.festDetail,
        festState: request.body.festState,
        festCost: parseFloat(request.body.festCost),
        userId:parseInt(request.body.userId),
        festNumDay:parseInt(request.body.festNumDay),
        festImage: req.file.path.replace("images\\fests\\", '') 
        },
      });
    } else {
      //แก้ไขข้อมูลแบบไม่มีการแก้ไขรูป
      result = await prisma.festTB.update({
        where: {
          festId: parseInt(request.params.festId),
        },
        data: {
        festName: request.body.festName,
        festDetail: request.body.festDetail,
        festState: request.body.festState,
        festCost: parseFloat(request.body.festCost),
        userId:parseInt(request.body.userId),
        festNumDay:parseInt(request.body.festNumDay),
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

exports.deleteFest = async (req,res) => {
  try {
    const result = await prisma.festTB.delete({
      where: {
        festId: parseInt(req.params.festId),
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