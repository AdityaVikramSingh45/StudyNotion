const Category = require("../models/category");

// Creating category handler function
exports.createCategory = async(req, res) => {
    try{
        //fetch data
        const {name, description} = req.body;

        //validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //create entry in db
        const categoryDetails = await Category.create({name, description});
        // console.log("Category created successfully", categoryDetails);

        //return response
        res.status(200).json({
            success: true,
            message: "Category created successfully",
        })
    }
    catch(err){
        console.log("Error while creating a category", err);
        res.status(500).json({
            success: false,
            message: "Error while creating a category",
        })
    }
}

// Get all categories handler function
exports.showAllCategories = async(req, res) => {
    try{
        const allCategories = await Category.find({}, {name: true, description: true});
        // console.log("All categories fetched successfully inside showAllCategoriessssss", allCategories);/
        res.status(200).json({
            success: true,
            message: "All categories fetched successfully",
            data: allCategories,
        })
    }
    catch(err){
        console.log("Error while getting all categories", err);
        res.status(500).json({
            success: false,
            message: "Error while getting all categories",
        })
    }
}

// Category page details handler function

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body // it will be req.query when the the method will be get rather than post coz In a GET request, data is typically sent in the query parameters (req.query), not in the request body.
      
      // console.log("PRINTING CATEGORY ID:"+categoryId);

      // Function to get a random integer
      function getRandomInt(max) {
        return Math.floor(Math.random() * max);
      }
			
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId).populate({
          path: "course",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        }).exec()
				// console.log("Selected Category:" ,selectedCategory );
				// console.log("Selected Category Negation:",!selectedCategory);
				
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
    //   if (selectedCategory.courses.length === 0) {
    //     console.log("No courses found for the selected category.")
    //     return res.status(404).json({
    //       success: false,
    //       message: "No courses found for the selected category.",
    //     })
    //   }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "course",
          match: { status: "Published" },
        })
        .exec()
        
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "course",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.course)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }



// exports.categoryPageDetails = async(req, res) => {
//     try{
//         //get category id
//         const {categoryId} = req.body;

//         //get courses for specific categoryId
//         const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

//         //validation
//         if(!selectedCategory){
//             return res.status(400).json({
//                 success: false,
//                 message: "Data not found for selected courses"
//             })
//         }

//         //get course for diff category
//         const differentCategories = await Category.find({_id: {$ne: categoryId}}).populate("courses").exec();
//         if(!differentCategories){
//             return res.status(400).json({
//                 success: false,
//                 message: "Data not found for different courses"
//             })
//         }
//         //get top selling course
//         //HW : TODO
//         //return response
//         return res.status(200).json({
//             success: true,
//             data: {
//                 selectedCategory,
//                 differentCategories,
//             },  
//             message: "Successfully fetched category page details"
//         })
//     }
//     catch(err){
//         console.log("Error while getting category page details", err);
//         res.status(500).json({
//             success: false,
//             message: "Error while getting all categories",
//         })
//     }
// }

