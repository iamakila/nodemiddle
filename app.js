const express = require('express')
const { type } = require('express/lib/response')

const mongoose = require('mongoose')
require('ejs')
// const Session = require('express-session')
// const MongoDbSession = require('connect-mongodb-session')(Session)


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')



const port = 5000
app.listen(port, () => {
    console.log('server runing on port: ', port)
})
mongoose.connect('mongodb+srv://akilanithila:akila2004@cluster0.ck0ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('server connected'))
    .catch((error) => console.log('server not connected', error))

app.get('/', (req, res) => {
    res.render('login')
})
app.get('/user', async (req, res) => {
    const books = await bookmodel.find({})
    console.log(books)
    return res.render('home', { books })
})
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/login-page', (req, res) => {
    res.render('login')
})
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})
const model = mongoose.model('aki_user', userSchema)
app.post('/sign', async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (username && email && password) {
            const temp = new model({
                name: username,
                email: email,
                password: password
            })
            const datasave = await temp.save()
            if (datasave) {
                return res.render('success',{ message: "User Registration successfully!" })
            }
            else {
                return res.render('fail',{ message: "User Registration failed!" })
            }
        }
        else{
            return res.render('fail',{ message: "Please provide all details!" })
        }
    }
    catch (err) {
        console.log('Error in registration: ', err)
        return res.send({ success: false, message: "Trouble in Student Registration, please contact support team!" })
    }
})
const bookSchema = mongoose.Schema({
    bookName: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: String, required: true },
    price: { type: String, required: true }
})
const bookmodel = mongoose.model('panda_user', bookSchema)

app.get('/updatebook', (req, res) => {
    res.render('bookupdate')
})
app.get('/addbook', (req, res) => {
    res.render('addbook')
})

app.post('/addbooks', async (req, res) => {
    try {
        const { bookName, author, description, rating, price } = req.body
        if (bookName && author && description && rating && price) {
            const temp = new bookmodel({
                bookName: bookName,
                author: author,
                description: description,
                rating: rating,
                price: price
            })
            const datasave = await temp.save()
            if (datasave) {
                return res.render('bookok', { message: "book added" })
                
            }
            else {
                return res.render('bookok', { message: "book not added" })
               
            }
        }
        else {
            return res.send({ success: false, message: "Please provide all details!" })
        }
    }
    catch (err) {
        console.log('Error in registration: ', err)
        return res.send({ success: false, message: "Trouble in Student Registration, please contact support team!" })
    }
})
app.get('/AdminHome', async (req, res) => {
    const books = await bookmodel.find({})
    console.log(books)
    return res.render('AdminHome', { books })
})
app.get("/update/:id", async (req, res) => {
    try {
        const book = await bookmodel.findById(req.params.id); // Fetch book by ID
        res.render("bookupdate", { book }); // Pass the book to the update page
    } catch (err) {
        res.status(500).send("Error fetching book for update");
    }
});

app.post("/update/:id", async (req, res) => {
    try {
        const { bookName, author, description, rating, price } = req.body;
        await bookmodel.findByIdAndUpdate(req.params.id, { bookName, author, description, rating, price });
        res.redirect("/adminhome"); // Redirect back to the home page
    } catch (err) {
        res.status(500).send("Error updating book");
    }
});


app.post("/delete/:id", async (req, res) => {
    try {
      await bookmodel.findByIdAndDelete(req.params.id); // Delete the book
      res.redirect("/adminhome"); // Redirect back to the home page
    } catch (err) {
      res.status(500).send("Error deleting book");
    }
  });
  app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body
        if(email&&password){
            const fetchemail=await model.findOne({email:email})
            console.log(fetchemail)
            if(fetchemail){

                if(fetchemail.password===password){
                    return res.render( 'success',{ message: "login successfully" })
                }
                else{
                    return res.render('fail',{ message: "Please provide correct password!" })
                }
            }
            else{
                return res.render('fail',{ message: "Please provide correct email!" })
            }
        }
        else{
            return res.render('fail',{ message: "Please provide all details!" })
        }

    }catch (err) {
      res.status(500).send("Error deleting book");
    }
  })
