  
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
chai.use(chaiHttp)

var server = require('../app');
describe('item-management', () => {
    it('it should GET all the item list from page 1', (done) => {
        chai.request(server)
        .get('/items/1')
        .end((err, res) => {
            (res).should.have.status(200);
            done();
        });
    });

    it('it should add the item',async (done) => {
         let itemdata = {
           "itemCode": "WSP84D9874",
           "itemTitle":"hoodie",
           "itemType":"fud",
           "Category":"clothes"
        }
        chai.request(server)
        .post('/items/')
        .send(itemdata)
        .end((err, res) => {
            (res).should.have.status(200);

        });
    });    
    it('it should delete particular item', (done) => {
        chai.request(server)
        .delete('/item/:603121523c2a6a1e407af503')
        .end((err, res) => {
            (res).should.have.status(201);
            done();
        });
    });
    it('it should update item', (done) => {
        chai.request(server)
        .put('/items?itemCode=5488')
        .end((err, res) => {
            (res).should.have.status(201);
            done();
        });
    });
});