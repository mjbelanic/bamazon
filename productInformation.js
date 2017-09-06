var orderInformation = function(itemId, productName, itemPrice, quantity, total){
    this.itemId = itemId;
    this.productName = productName;
    this.itemPrice = itemPrice;
    this.quantity = quantity;
    this.total = total;
};

module.exports = orderInformation;