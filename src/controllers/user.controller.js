
// const _ = require("lodash");
// const userModel = require("../models/user.model");


// class UserController {
//   /**
//    * @description Get All waiting list Students
//    * @route /api/waitingList
//    * @method GET
//    * @access public
//    */
//   static async getAllWaitingList(req, res) {
//     try {
//       const waitingList = await waitingListModel
//         .find()
//         .populate(
//           "student",
//           "fullName email nationalID address dateOfBirth phone graduationGrade files"
//         );
//       // .populate("round", "");
//       res.status(200).json({
//         results: waitingList.length,
//         waitingList,
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   /**
//    * @description Add a new student to the waiting list
//    * @route /api/waitingList/
//    * @method POST
//    * @access public
//    */
//   static async addWaitingList(req, res) {
//     try {
//       const body = _.pick(req.body, ["student", "round"]);
//       if (!body.student || !body.round) {
//         res.status(400).json("Missing data");
//       } else {
//         // Check if a document with the same student and round ID exists
//         const existingWaiting = await waitingListModel.findOne({
//           student: body.student,
//           round: body.round,
//         });

//         if (existingWaiting) {
//           return res.status(400).json({
//             message:
//               "Document with the same student and round ID already exists.",
//           });
//         }

//         const waitingList = await waitingListModel.create(body);
//         res.status(201).json(waitingList);
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }
// }

// module.exports = UserController;