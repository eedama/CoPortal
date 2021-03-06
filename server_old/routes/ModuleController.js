var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
import mongoose from 'mongoose';

// import the models
import Module from '../models/Module';
//import Attachment from '../models/Attachment'
import LectureNote from '../models/LectureNote';
import Admin from '../models/Admin';
import Lecturer from '../models/Lecturer';
import Student from '../models/Student';
import Solution from '../models/Solution';
import MarkSheet from '../models/MarkSheet';

/*
  TODO : Add notification (done)
         Remove notification
         Search
         Mark as seen
         Get all  (done)
         Get all for user (done),
         Get all from user (done)
*/
router.get('/modules/all', function(req, res) {
	Module.find()
		.populate(['lecturers'])
		.populate(['students'])
		.populate(['questionaires'])
		.populate({
			path: 'notes',
			select: 'title description type date',
		})
		.then(modules => {
			if (modules == null) return res.status(512).send('No modules where found');

			res.json(modules);
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.get('/get/lecturer/notes/:notesID', function(req, res) {
	var notesID = req.params.notesID;
	LectureNote.findById(notesID)
		.then(notes => {
			if (notes == null) return res.status(512).send('No notes where found');
			res.json(notes);
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.get('/modules/all/for/:userID/:userType', function(req, res) {
	var userID = req.params.userID;
	var userType = req.params.userType;

	Module.find()
		.populate(['lecturers'])
		.populate(['students'])
		.populate(['questionaires'])
		.populate({
			path: 'notes',
			select: 'title description type date',
		})
		.then(async modules => {
			if (modules == null) return res.status(512).send('No modules where found');
			// TODO: to speed up ,,, add this on the find
			
			for(var _module of modules){
					if(_module.questionaires){
						for(var questionaire of _module.questionaires){		
							var solutions = await Solution.find({
								studentId: userID,
								questionaireId: questionaire._id,
							});
							questionaire.totalAttempts = solutions ?  solutions.length : 0;
						}
					}
			}

			modules = modules.filter(
				m =>
					userType == 'ADMIN' ||
					m.students.filter(s => s._id == userID).length > 0 ||
					m.lecturers.filter(l => l._id == userID).length > 0
			);
			res.json(modules);
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.get('/marksheet/for/:userID/moduleID/:moduleID', function(req, res) {
	var userID = req.params.userID;
	var moduleID = req.params.moduleID;
	function getHighest(studentMarks){
		var highest = 0;
		if(studentMarks){
			studentMarks.forEach(mark =>{
				if(mark > highest){
					highest = mark;
				}
			});
		}
		return highest;
	}

	MarkSheet.find({
		moduleID,
		removed: false,
		studentMarks: {
			$elemMatch: {
				studentID: mongoose.Types.ObjectId(userID),
			},
		},
	})
		.then(markSheet => {
			var ms = markSheet.map(m => {
				var obj = {
					_id: m._id,
					type: m.type,
					id: m.id,
					title: m.title,
					date: m.date,
					mark: getHighest(m.studentMarks.filter(sm => sm.studentID == userID).map(m => m.mark)),
					total: m.total,
					studentID: userID,
					lecturerID: m.lecturerID,
					moduleID: m.moduleID,
				};
				return obj;
			});
			ms.reverse();
			return res.json(ms);
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.get('/get/module/:moduleId', function(req, res) {
	var moduleId = req.params.moduleId;
	Module.findById(moduleId)
		.populate(['lecturers'])
		.populate(['students'])
		.populate(['questionaires'])
		.populate(['notes'])
		.then(module => {
			if (module == null) return res.status(512).send('Module was not found');
			res.json(module);
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.post('/add/new/module', function(req, res) {
	Module.findOne({
		name: req.body.module.name,
		code: req.body.module.code,
	}).then(results => {
		if (results != null)
			return res.status(512).send(`Module ${req.body.module.name}(${req.body.module.code}) already exist`);
		var module = new Module({
			_id: mongoose.Types.ObjectId(),
			name: req.body.module.name,
			code: req.body.module.code,
			description: req.body.module.description,
		});

		module.save(function(err) {
			if (err) return res.status(512).send('Server error : ' + err.message);
			Module.find()
				.populate(['lecturers'])
				.populate(['students'])
				.populate(['questionaires'])
				.populate(['notes'])
				.then(modules => {
					if (modules == null) return res.status(512).send('Server error : sadbbyjwyqduqwgyu');
					res.json(modules);
				});
		});
	});
});

router.post('/add/bulk/modules', async function(req, res) {
	let modules = req.body.modules;
	if (!modules) {
		return res.status(512).send('Server error : Invalid request');
	}

	modules = modules.filter((value, index, self) =>  self.findIndex(v => v.name == value.name && v.code == value.code) == index);
	var succeded=[],failed=[];
	let count = 0;
	for (var _module of modules.filter(m => m)) {
  try {
      var results = await Module.findOne({
        name: _module.name,
        code: _module.code,
      });
      if (!results){
        var mmodule = new Module({
          _id: mongoose.Types.ObjectId(),
          name: _module.name,
          code: _module.code,
          description: _module.description,
        });

        var saved = await mmodule.save();
        if(saved) {
          succeded.push(saved);
        }else{
          failed.push(mmodule.name + " failed");
        }
      }else{
        failed.push(results.name +  " " + results.code + " already exists");
      }
    }catch(ex){
      failed.push(ex.message);
    }
		console.log(count++,{
			failed:failed.length > 0 ? failed[failed.length-1] : 0,
			succeded:succeded.length > 0 ? succeded[succeded.length-1] : 0
		})
  }
  return res.json({
    succeded:succeded,
    failed:failed
  })
});

function GeneratePassword(password)
{
var saltRounds = 13;
var salt = bcrypt.genSaltSync(saltRounds);
var hash =   bcrypt.hashSync(password, salt);
return hash;
}

router.post('/fix/dublicates', async function(req, res) {
	Student.find({

	}).then(modules =>{
		modules.forEach(m =>{
			if(m.modules){
				try{
				let total = m.modules.length;
				m.modules = m.modules.filter((value, index, self) =>  self.findIndex(v => v.name.trim() == value.name.trim() && v.code.trim() == value.code.trim()) === index);
				if(total != m.modules.length){
					console.log("from " + total + " to " + m.modules.length);
				//	m.save();
				}else{
					console.log("Synced at " + total);
				}
			}catch(err){
				console.log(err.message);
			}
			}
		})
	});
	res.send("Working.....")
})

router.post('/link/bulk/modules/to/bulk/students', async function(req, res) {
	const studentAndModules = req.body.studentAndModules;
	if(!studentAndModules || studentAndModules.length <= 0){
		return res.status(512).send('Server error : Invalid request');
	}

  var succeded=[],failed=[];

	const allModules = await Module.find({

	},"_id name code students");
	let count = 0;
	for(let currentModule of allModules.filter(m => m && m.name && m.code)){		
		const moduleNameCode = `${currentModule.name.trim()}-${currentModule.code.trim()}`;
		console.log("Trying to link",moduleNameCode);
		if(!studentAndModules.some(s => s[moduleNameCode])){
			console.log("No student does " + moduleNameCode);
			continue;
		}
		for(let _student of studentAndModules.filter(s => s[moduleNameCode])){
			if(!_student[moduleNameCode]){
				continue;
			}
			let firstname = _student.name.toLowerCase().split(',')[0].trim();
			let lastname = _student.name.toLowerCase().split(',')[1].trim();
			let username = firstname.toLowerCase().replace(/ /g,'')+'-'+lastname.toLowerCase().replace(/ /g,'').split(' ')[0];
			try {
				let _ss = await Student.findOne({
					username:username
				},"_id firstname lastname username modules");
				if(_student[moduleNameCode]){
						if(!_ss){
							_ss = new Student({
								_id:mongoose.Types.ObjectId(),
								username:username,
								firstname:firstname,
								lastname:lastname,
								password:GeneratePassword(lastname),
								idNumber:'0000000000000' + (Math.random()*100000) + count++
							});
						 //	console.error("????????????? " + username + " is not in the DB - " + moduleNameCode);
						}
						var saved = false;
						if(!currentModule.students.some(sm => sm.toString() == _ss._id.toString())){
							currentModule.students.push(_ss._id);
							currentModule.save(function(err){
								if(err){
									console.error("<<<<<<<<<Failed to link module " + _ss.username + " to " + moduleNameCode);
									console.log(err.message);
									failed.push(currentModule.name + " failed");
								}else{
									console.log('Linked module ' + _ss.username + " to " + moduleNameCode);
									succeded.push(saved);
								}
							});
						}
						if(!_ss.modules.some(ms => ms.toString() == currentModule._id.toString())){	
							_ss.modules.push(currentModule._id.toString());
							_ss.save(function(err){
								if(err){
									console.error("<<<<<<<<<Failed to link " + _ss.username + " to " + moduleNameCode);
									console.log(err.message);
									failed.push(currentModule.name + " failed");
								}else{
									console.log('Linked ' + _ss.username + " to " + moduleNameCode);
									succeded.push(saved);
								}
							});
						}
					}else{
					//	console.log("Couldn't find",_ss);
					//	console.log("Couldn't find",moduleNameCode + " " + _student[moduleNameCode]);
					}
			}catch(ex){
				console.log(ex.message);
				failed.push(ex.message);
			}
		}
	}
	console.log("!!!!! DONE !!!!!");
  return res.json({
    succeded:succeded,
    failed:failed
  })
});

router.post('/assign/to/lecturer/:lecturerID', function(req, res) {
	var lecturerID = req.params.lecturerID;
  if(!req.body.modules) return res.status(512).send('Server error : invalid request');

	var lecturerModules = new Array();

	req.body.modules
		.filter(m => m != null)
		.map(m => {
			lecturerModules.push(mongoose.Types.ObjectId(m));
		});

	Lecturer.findById(lecturerID)
		.then(lecturer => {
			if (lecturer == null) return res.status(512).send('Lecturer was not found');
			Module.find({
				_id: {
					$in: lecturerModules,
				},
			})
				.then(modules => {
					lecturerModules = modules
						.filter(m => lecturer.modules.filter(sm => sm == m._id).length == 0)
						.map(m => m._id);
					lecturer.modules.push(lecturerModules);
					lecturer.save(function(err) {
						if (err) return res.status(512).send('Server error : ' + err.message);
						res.json(true);
					});
				})
				.catch(err => {
					console.log(err);
					return res.status(512).send('Server error : ' + err.message);
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.post('/unassign/module/:moduleID/from/lecturer/:lecturerID', function(req, res) {
	var lecturerID = req.params.lecturerID;
	var moduleID = req.params.moduleID;

	Lecturer.findById(lecturerID)
		.then(lecturer => {
			if (lecturer == null) return res.status(512).send('Lecturer was not found');
			Module.findById(moduleID)
				.then(module => {
					if (module == null) return res.status(512).send('Module was not found');
					var victim = lecturer.modules.find(m => m == moduleID);
					console.log('before ' + lecturer.modules.length);
					console.log(victim);
					if (victim != null) {
						var index = lecturer.modules.indexOf(victim);
						console.log(index);
						lecturer.modules.splice(index, 1);
					}
					console.log('after ' + lecturer.modules.length);
					lecturer.save(function(err) {
						if (err) return res.status(512).send('Server error : ' + err.message);
						res.json(true);
					});
				})
				.catch(err => {
					console.log(err);
					return res.status(512).send('Server error : ' + err.message);
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.post('/assign/to/student/:studentID', function(req, res) {
	var studentID = req.params.studentID;

	var studentModules = new Array();

	req.body.modules
		.filter(m => m != null)
		.map(m => {
			studentModules.push(mongoose.Types.ObjectId(m));
		});

	Student.findById(studentID)
		.then(student => {
			if (student == null) return res.status(512).send('Student was not found');
			Module.find({
				_id: {
					$in: studentModules,
				},
			})
				.then(modules => {
					studentModules = modules
						.filter(m => student.modules.filter(sm => sm == m._id).length == 0)
						.map(m => m._id);
					student.modules.push(studentModules);
					student.save(async function(err) {
						if (err) return res.status(512).send('Server error : ' + err.message);
						for(var _module  of modules){
								if (!_module.students) _module.students = [];
								if (!_module.students.some(v => v == studentID)) _module.students.push(studentID);
								await _module.save();
						}
						res.json(true);
					});
				})
				.catch(err => {
					console.log(err);
					return res.status(512).send('Server error : ' + err.message);
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.post('/unassign/module/:moduleID/from/student/:studentID', function(req, res) {
	var studentID = req.params.studentID;
	var moduleID = req.params.moduleID;

	Student.findById(studentID)
		.then(student => {
			if (student == null) return res.status(512).send('Student was not found');
			Module.findById(moduleID)
				.then(module => {
					if (module == null) return res.status(512).send('Module was not found');
					var victim = student.modules.find(m => m == moduleID);
					console.log('before ' + student.modules.length);
					console.log(victim);
					if (victim != null) {
						var index = student.modules.indexOf(victim);
						console.log(index);
						student.modules.splice(index, 1);
					}
					console.log('after ' + student.modules.length);
					student.save(function(err) {
						if (err) return res.status(512).send('Server error : ' + err.message);
						res.json(true);
					});
				})
				.catch(err => {
					console.log(err);
					return res.status(512).send('Server error : ' + err.message);
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.get('/get/solution/id/for/:questionaireID/by/:userType/of/id/:userID', function(req, res) {
	var questionaireID = req.params.questionaireID;
	var userType = req.params.userType;
	var userID = req.params.userID;

	var studentID = userType == 'LECTURER' || userType == 'ADMIN' ? null : userID;
	var isMemo = userType == 'LECTURER' || userType == 'ADMIN';

	console.log(studentID + ' ' + isMemo);
	Solution.findOne({
		questionaireId: questionaireID,
		studentId: studentID,
		isMemo: isMemo,
	})
		.then(solution => {
			if (solution == null && (userType == 'LECTURER' || userType == 'ADMIN')) {
				return res.status(512).send('No solution for this questionaire');
				return;
			} else if (solution == null) {
				res.json({
					id: null,
				});
			} else {
				res.json({
					id: solution._id,
				});
			}
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.get('/get/questionaire/solutions/for/all/students/:questionaireID', async function(req, res) {
	var questionaireID = req.params.questionaireID;
	Solution.find({
		questionaireId: questionaireID,
		isMemo: false,
	})
		.sort('-date')
		.populate('questionaireId', '_id title')
		.populate('studentId', '_id firstname lastname')
		.then(solutions => {
			if (solutions == null) {
				return res.status(512).send('No solutions for this questionaire');
			}
			var answer = [];
			solutions
				.filter(s => s.studentId && s.studentId._id)
				.forEach(solution => {
					if (!answer.some(s => s.studentId._id.toString() == solution.studentId._id.toString())) {
						answer.push(
							Object.assign(
								{
									attempts: 1,
								},
								solution.toObject()
							)
						);
					} else {
						answer.find(s => s.studentId._id.toString() == solution.studentId._id.toString()).attempts++;
					}
				});
			return res.json(answer);
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.get('/get/questionaire/solutions/for/module/:moduleId', async function(req, res) {
	var moduleId = req.params.moduleId;
	Module.findById(moduleId)
		.populate(['questionaires'])
		.then(async module => {
			if (module == null) return res.status(512).send('Module was not found');
			if (!module.questionaires) module.questionaires = [];
			var questionaires = [];
			for (var i = 0; i < module.questionaires.length; i++) {
				const questionaireId = module.questionaires[i]._id;
				const questionaireTitle = module.questionaires[i].title;
				const questionaireTotalQuestions = module.questionaires[i].questions.length;
				const questionaireDate = module.questionaires[i].date;
				var solutions = await Solution.find({
					questionaireId: questionaireId,
				});
				var passed = 0;
				var failed = 0;
				solutions.forEach(solution => {
					if (solution.mark >= questionaireTotalQuestions / 2) {
						passed++;
					} else {
						failed++;
					}
				});
				questionaires.push({
					id: questionaireId,
					title: questionaireTitle,
					totalQuestions: questionaireTotalQuestions,
					date: questionaireDate,
					passed: passed,
					failed: failed,
					wrote: passed + failed,
				});
			}
			res.json(questionaires);
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.post('/add/notes/title/:title/description/:description', function(req, res) {
	var title = req.params.title;
	var description = req.params.description;
	var file = req.body.file;
	var lecturerId = req.body.lecturerId == 'ADMIN' ? null : req.body.lecturerId;
	var moduleId = req.body.moduleId;
	Module.findById(moduleId)
		.then(module => {
			if (module == null) new Error('Module does not exist');
			if (module.lecturers.indexOf(lecturerId) < 0 && lecturerId != null)
				new Error('Lecturer does not exist or he/she is not incharge of this module');

			var lecturerNote = new LectureNote({
				_id: mongoose.Types.ObjectId(),
				lecturerId: lecturerId,
				moduleId: moduleId,
				title: title,
				description: description,
				file: file,
				type: file.fileType,
			});

			lecturerNote.save(function(err) {
				if (err) return res.status(512).send('Server error : ' + err.message);
				module.notes.push(lecturerNote._id);
				module.save(function(err) {
					if (err) return res.status(512).send('Server error : ' + err.message);
					res.json(lecturerNote._id);
				});
			});
		})
		.catch(err => {
			return res.status(512).send('Server error : ' + err.message);
		});
});

router.get('/download/notes/:notesId', function(req, res) {
	var notesID = req.params.notesId;
	LectureNote.findById(notesID)
		.then(note => {
			if (note == null) return res.status(512).send('Unable to find the specified note');
			return res.send(note.file);
		})
		.catch(err => {
			return res.status(512).send(err.message);
		});
});

router.get('/download/pdf/file/:notesId',function(req,res){
	var notesID = req.params.notesId;
	LectureNote.findById(notesID)
		.then(note => {
			if (note == null || !note.file || !note.file.base64StringFile) return res.status(512).send('Unable to find the specified note');
				const base64 = note.file.base64StringFile.split('base64,');
				if(!base64 || base64.length != 2 || base64[1].length < 20){
						throw new Error("PDF file is corrupted, please contact admin");
				}

				res.writeHead(200, {
					'Content-Type': 'application/pdf',
					'Content-Disposition': `attachment; filename="${note.title ? note.title.replace(/ /g,'-') : note.file.fileName}.pdf"`
				});
				const download = Buffer.from(base64[1].toString('utf-8'), 'base64');
				return res.end(download);
		})
		.catch(err => {
			return res.status(512).send(err.message);
		});
});

module.exports = router;
