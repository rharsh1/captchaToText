 const express = require('express')
const multer = require('multer')
const tesseract = require('node-tesseract-ocr')
const path = require('path')
  

 

const app = express();

app.use(express.static(path.join(__dirname + 'uploads')))

app.set("view engine","ejs")

const storage = multer.diskStorage({
    destination:function(req,file,cp){
        cp(null,"uploads")
    },
    filename:function(req,file,cp){
        cp(
            null,
            file.fieldname + "-" + Date.now() +path.extname(file.originalname)
        )
    }
})

const upload = multer({storage:storage})

app.get('/', (req,res)=>{
    res.render("index",{data:''})
})

app.post('/extractText', upload.single('file'),(req,res)=>{
   console.log(req.file.path);
   const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
    tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  }
  
  tesseract
    .recognize( req.file.path, config)
    .then((text) => {
      console.log("Result:", text)
      res.render('index',{data:text})
      return
    })
    .catch((error) => {
      console.log("error",error.message)
    }) 
 
})  

app.listen(3000,()=>{  
    console.log("running on PORT : 3000");
})                   