const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];

app.get('/', (req, res) => {
    res.send('Lets Do It!!');
});

app.get('/api/courses', (req, res) => {
    //Sending details of courses
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    //Validation using Joi package
    //const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Adding course
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //look up the course
    //if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course with given id is not found');
    //validate
    //if invalid, return 404 - bad request
    //const result = validateCourse(req.body);
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //update course
    course.name = req.body.name;
    res.send(course);
    //return updated course
});

app.delete('/api/courses/:id', (req, res) => {
    //look up the course
    //not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course with given id is not found');
    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
    //return the same course
});

app.get('/api/courses/:id', (req, res) => {
    //getting course with given ID
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course with given id is not found');
    res.send(course);
});



// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening..${port}`));

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}