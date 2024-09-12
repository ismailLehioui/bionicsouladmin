const path=require('path')
const multer= require('multer')

const myStorage = multer.diskStorage({

    destination: function(req,file,cb){
        cb(null,path.join(__dirname,"../images"))
    },
    filename: function(req, file, cb) {
        if(file){
            cb(null,new Date().toISOString().replace(/:/g,"-") + file.originalname);
        }else{
            cb(null,false)
        }
    }
});



const phtoUpload = multer(
    { storage: myStorage ,
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith("image")){
            cb(null,true)
        }else{
            cb({message: "Unsupported file format"},false);
        }
    },
    limits:{ fileSize:1024*1024*2 }
});


module.exports = phtoUpload;


