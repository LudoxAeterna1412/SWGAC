class Model {
    constructor(model){
        this.model = model;
    }
    async getAll() {
        return this.model.find();
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async create(data) {
        const model = new this.model(data);
        return model.save();
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}
module.exports = Model;