let express = require('express')

const itemController = require('../controller/itemController')

var router = express.Router();
router.use(express.static(__dirname+"./public/"));
router.get('/form',(req,res,next)=>{
    res.render('form')
})
router.get('/',itemController.searchItem)
router.get('/:page',itemController.getItems)

router.post('/',itemController.postItem)

router.get('/item/:id',itemController.getOneItem)

router.put('/',itemController.updateItem)

router.delete('/item/:id',itemController.deleteItem)

module.exports = router



