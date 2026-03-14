const EmployeeModel = require("../Models/EmployeeModel");

const createEmployee = async (req, res) => {
   try {
    const body = req.body;
    body.profileImage =  req.file ? req.file?.path : null;
    console.log(body);
    const emp = new EmployeeModel(body);
    await emp.save();
    res.status(201)
         .json({
        message: "Employee created",
        success: true,
    })
} catch(err){
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: err
    })
   }
}

const updateEmployeeById = async (req, res) => {
   try {
    const {name, email, phone, salary, department} = req.body;
    const { id } = req.params;
    
    let updateData = {
        name, email, phone, salary, department, updatedAt: new Date()
    }

    if(req.file){
        updateData.profileImage = req.file.path;
    }
    const updateEmployee = await EmployeeModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    )
    if(!updateEmployee){
        return res.status(404).json({ message: 'Employee Not Found' });
    }
    res.status(200)
         .json({
        message: "Employee Updated",
        success: true,
        data: updateEmployee
    });
} catch(err){
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: err
    })
   }
}

const getAllEmployees = async (req, res) => {
   try {
    let {page, limit, search} = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;

    const skip = (page-1) * limit;  // (1-1)=0, 0*5=0.   (2-1)=1, 1*5=5

    // page = 1 => (1-1)*5 = 0 skip
    // page = 2 => (2-1)*5 = 5 skip
    // page = 3 => (3-1)*5 = 10 skip


    let searchCriteria = {};
    if(search){
        searchCriteria = {
            name: {
                $regex: search,
                $options: 'i'   //i means case insensitive
            }
        }
    }

    const totalEmployess= await EmployeeModel.countDocuments(searchCriteria);



    const emps = await EmployeeModel.find(searchCriteria)
      .skip(skip)
      .limit(limit)
      .sort({updatedAt: -1});

      const totalPages = Math.ceil(totalEmployess / limit);

    res.status(200)
         .json({
        message: "All Employees",
        success: true,
        data: {
            employees: emps,
            pagination:{
                totalEmployess,
                currentPage: page,
                totalPages,
                pageSize: limit
            }
        }
    })
} catch (err){
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: err
    })
   }
}

const getEmployeeById = async (req, res) => {
   try {
    const { id } = req.params;
    const emp = await EmployeeModel.findOne({ _id: id });
    res.status(200)
        .json({
        message: "Get Employee Details",
        success: true,
        data: emp
    })
} catch(err){
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: err
    })
   }
}

const deleteEmployeeById = async (req, res) => {
   try {
    const { id } = req.params;
    const emp = await EmployeeModel.findByIdAndDelete({ _id: id });
    res.status(200)
        .json({
        message: "Employee deleted",
        success: true
    })
} catch(err){
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: err
    })
   }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById
}