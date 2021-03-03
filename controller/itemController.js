const itemModel =  require('../models/items.js')
const middleware = require('../middleware/middleware')
const { body, validationResult } = require('express-validator');
var multiparty = require('multiparty');
exports.searchItem = async function(req, res){
    try{
        var query = req.query
        var perPage = 5
        var currentPage = req.query.page|| 1;
        let from =(perPage * currentPage) - perPage+1
        let to =perPage * currentPage
        let itemCode = query.itemCode||""
        let itemTitle= query.itemTitle||""
        if(itemCode!=""&&itemTitle!=""){
            var flterParameter={ $and:[itemCode,itemTitle]}
        }else if(itemCode!=""&& itemTitle==""){
            var flterParameter={itemCode:itemCode}
        }else if(itemCode==""&& itemTitle!=""){
            var flterParameter = {itemTitle:itemTitle}
        }else{
            var flterParameter={}
          }
    
      itemModel.find(flterParameter)
        .sort()
        .skip((perPage * currentPage) - perPage)
        .exec(function(err,data){
            itemModel.countDocuments().exec((err,count)=>{
                if (err){
                    res.status(400).send({err:err})
                };
                let sendData={
                    from:from,
                    to:to,
                    perPage:perPage,
                    currentPage:Number(currentPage),
                    lastPage:Math.ceil(count / perPage),
                    total:count,
                    content:data
                  }
                res.status(200).json(sendData)
            })
        })
    }catch(e){
        res.status(400).json(e)
      }

}

exports.getItems = async (req, res, next) =>{
    try{
        var perPage = 5
        var currentPage = req.params.page|| 1;
        let from =(perPage * currentPage) - perPage+1
        let to =perPage * currentPage
         await itemModel.find({})
                       .sort({itemTitle:1})
                       .skip((perPage * currentPage) - perPage)
                       .exec(function(err, data) {
                        itemModel.countDocuments().exec(async function(err, count) {
                            if (err) throw err;
                            let sendData={
                                from:from,
                                to:to,
                                perPage:perPage,
                                currentPage:Number(currentPage),
                                lastPage:Math.ceil(count / perPage),
                                total:count,
                                content:data
                              }
                              res.status(200).json(sendData)
                        })
          })
    }catch(e){
     return   res.status(400).json(e)
    }
}

exports.postItem =async (req, res, next)=>{
    try{
        var form = new multiparty.Form();
        form.parse(req,async (err, fields, files)=> { 
            let sendObject={}
            let itemTypes = ['FUL','FUD','ALL','Physical','chemical']
            var sorted = [];
            itemTypes.forEach(item=>{
                sorted.push(item.toLowerCase())
            })
            Object.keys(fields).forEach(function(name) {
                sendObject[name] = fields[name][0];
                    if(name=='available'){
                        if(sendObject[name]=='on'){
                            sendObject[name]=true;
                        }else if(sendObject[name]=='off'){
                            sendObject[name]=false;
                        }
                    }else{
                        sendObject.available=false;
                    }
                    if(name=="itemType"){
                        let find = sendObject[name]
                        if(!sorted.includes(find.toLowerCase())){
                            return   res.status(400).send({err:"Item type not found"})
                        }
                    }
              });     
             
              let itemData = new itemModel(sendObject)
              console.log(files.itemImages)
              if(files.itemImages !==undefined) {
                    if(err){
                        return   res.status(400).send({err:"Images can't be uploaded"+err})
                    }
                    var photoarr =[]
                    var imgArray = files.itemImages;
                    for (var i = 0; i < imgArray.length; i++) {   
                      if(imgArray[i].size>0){
                           var fileType = imgArray[i].headers['content-type']
                           if(imgArray[i].originalFilename!=undefined &&fileType =='image/png' || fileType =='image/jpeg'){
                            var newPath = './public/uploads/'+Date.now()+ imgArray[i].originalFilename;
                            var singleImg = imgArray[i];
                            middleware.readAndWriteFile(singleImg, newPath); 
                            photoarr.push(newPath)
                      }else{
                              return  res.status(400).send({err:"Images Type does not match"})
                         } 
                      }
                    }
                    if(photoarr.length>0){
                         itemData.itemImages=photoarr
                    }
            }
                    itemData.save(async (err,data) =>{
                    if(err){
                        return    res.status(400).send({msg:err})
                          }
                  res.status(201).json(data)
                })        
        })
    }catch(e){
      return  res.status(400).json(e)
    }
   
}
exports.updateItem=async (req, res) => {
    try{
        const id = req.query.itemCode
        var form = new multiparty.Form();
        form.parse(req,async (err, fields, files)=> {
            let sendObject={}
            let itemTypes = ['FUL','FUD','ALL','Physical','chemical']
            var sorted = [];
            itemTypes.forEach(item=>{
                sorted.push(item.toLowerCase())
            })
            Object.keys(fields).forEach(function(name) {
                sendObject[name] = fields[name][0];
                    if(name=='available'){
                        if(sendObject[name]=='on'){
                            sendObject[name]=true;
                        }else if(sendObject[name]=='off'){
                            sendObject[name]=false;
                        }
                    }
                    if(name=="itemType"){
                        let find = sendObject[name]
                        if(!sorted.includes(find.toLowerCase())){
                            return   res.status(400).send({err:"Item type not found"})
                        }
                    }
              });
              if(files.itemImages !==undefined) {
                if(err){
                    return   res.status(400).send({err:"Images can't be uploaded"+err})
                }
                var photoarr =[]
                var imgArray = files.itemImages;
                for (var i = 0; i < imgArray.length; i++) {   
                  if(imgArray[i].size>0){
                       var fileType = imgArray[i].headers['content-type']
                       if(imgArray[i].originalFilename!=undefined &&fileType =='image/png' || fileType =='image/jpeg'){
                        var newPath = './public/uploads/'+Date.now()+ imgArray[i].originalFilename;
                        var singleImg = imgArray[i];
                        middleware.readAndWriteFile(singleImg, newPath); 
                        photoarr.push(newPath)
                  }else{
                          return  res.status(400).send({err:"Images Type does not match"})
                     } 
                  }
                }
                if(photoarr.length>0){
                    sendObject.itemImages=photoarr
                }
        }
                itemModel.updateOne({'itemCode':id},{$set:sendObject}, {upsert: true},async function(err,data){
                    if(err) throw err;
                    if(data.nModified==1){
                    res.status(200).json({msg:"item is updated"});
                    }else if(data.nModified==0){
                        res.status(200).json({msg:"item is already updated"});
                    }else{
                        res.status(400).json({msg:"error"+err});
                    }
                })
         })
    }catch(e){
        return   res.status(400).json(e)   
    }
   
}
exports.getOneItem =async (req, res, next)=>{
    try{
        var itemId = req.params.id
        await itemModel.findById({_id: itemId},async (err,result)=>{
             if(err){
                 return res.status(400).json({error: err});
             }
             res.status(200).json(result);
    })
    }catch(e){
        return   res.status(400).json(e)
    }

}

exports.deleteItem =async (req, res) => {
    try{
        const id = req.params.id
        var deleteItem = itemModel.findByIdAndDelete(id)
        deleteItem.exec((err,data)=>{
            if(err){
                return res.status(400).send(data)
            }
            res.status(200).json(data,{msg:'item deletes'})
        })
    }catch(e){
        return   res.status(400).json(e)
    }

 }