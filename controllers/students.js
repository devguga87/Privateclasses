const fs = require('fs')
const data = require('../data.json')
const{age, date} = require('../utils')
const{graduation} = require('../utils')
const Intl = require('intl')


//index
exports.index = function(req,res){
    return res.render("students/index", {students : data.students})
}

//create
exports.post = function(req,res) { 
    const keys= Object.keys(req.body)
    for(key of keys){
        if(req.body[key]==""){
            return res.send("Please, fill all the fields")
        }
    }
    let {avatar_url, birth, name, email,type,classes} = req.body
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.students.length +1)

    data.students.push({
        id,
        name,
        avatar_url,
        birth,
        email,
        type,
        classes,
        created_at
    })
    fs.writeFile("data.json", JSON.stringify(data,null,2),function(err){
        if(err) return res.send("Write file erro")
        return res.redirect("/students")
    })
 }

//show
exports.show = function(req,res){
    const{id} =req.params
    const foundStudent = data.students.find(function(student){
        return student.id == id
    })
    
    if(!foundStudent) return res.send("student not found")
    
    const student = {
        ...foundStudent,
        age:age(foundStudent.birth),
        type:"",
        classes:foundStudent.classes.split(","),
        created_at:new Intl.DateTimeFormat('pt-BR').format(foundStudent.created_at)
    }

    return res.render("students/show", {student:student})
} 

//edit
exports.edit = function(req,res){
    const{ id }= req.params

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if(!foundStudent) return res.send("student not found")
    const student ={
        ...foundStudent,
        birth: date(foundStudent.birth)
    }
    return res.render('students/edit',{student})

}

//put
exports.put = function(req,res){
    const { id } = req.body
    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex){
        if (id == student.id){
            index = foundIndex
            return true
        }
    })
    if(!foundStudent) return res.send ("student not found")
    
    const student = {
        ...foundStudent,
        ...req.body,
        id: Number(req.body.id),
        birth: Date.parse(req.body.birth)
    }
    data.students[index] = student

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write error")
        return res.redirect(`/students/${id}`)
    })
}

//delete
exports.delete = function(req,res){
    const { id } = req.body
    const filteredstudents = data.students.filter(function(student){
        return student.id != id
    })

    data.students = filteredstudents

    fs.writeFile("data.json", JSON.stringify(data, null,2),function(err){
        if(err) return res.send("Write file error")
        return res.redirect("/students")
    })
}



