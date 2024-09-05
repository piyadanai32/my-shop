import mongoose from 'mongoose';

const uri = "mongodb+srv://admin:1234@cluster0.gj9kl.mongodb.net/my-shop";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch(err => {
    console.error("MongoDB connection error:", err);
});
