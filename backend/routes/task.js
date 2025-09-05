const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const TaskAssignment = require('../models/TaskAssignment');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

// Route 1:  Create a Task (Admin only) POST /api/tasks (Admin must be authenticated; check req.user.isAdmin)
// Create task and assign to all interns (automatic assignment)
router.post('/', fetchuser, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send({ error: "Access denied" });
    try {
        const { title, description } = req.body;
        const task = await Task.create({
            title,
            description,
            postedBy: req.user.id
        });
        // Find all interns
        const interns = await User.find({ isAdmin: false }).select('_id');
        // Assignments for all interns
        const assignments = await Promise.all(interns.map(({ _id }) =>
            TaskAssignment.create({
                task: task._id,
                intern: _id
            })
        ));
        res.json({ success: true, task, assignments });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
});

//Route 2: Get all tasks details(Admin only)
router.get('/admin', fetchuser, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "Access denied" });
        }

        const tasks = await Task.find({ postedBy: req.user.id }).lean();

        const tasksWithAssignments = await Promise.all(
            tasks.map(async task => {
                const assignments = await TaskAssignment.find({ task: task._id })
                    .populate('intern', 'name email')
                    .lean();
                return { ...task, assignments };
            })
        );

        res.json({ tasks: tasksWithAssignments });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//Route 3: Get All Assigned Tasks (Intern) GET /api/tasks/assigned (Intern sees only tasks assigned to them.)
router.get('/assigned', fetchuser, async (req, res) => {
    if (req.user.isAdmin) return res.status(403).send({ error: "Admins cannot view this" });
    try {
        const assignments = await TaskAssignment.find({ intern: req.user.id })
            .populate('task');
        res.json({ success: true, assignments });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
});

//Route 4: Submit Work (Intern) PUT /api/tasks/submit/:taskId
router.put('/submit/:taskId', fetchuser, async (req, res) => {
    try {
        const assignment = await TaskAssignment.findOne({
            task: req.params.taskId,
            intern: req.user.id
        });
        if (!assignment) return res.status(404).send({ error: "Assignment not found" });
        assignment.submissionLink = req.body.submissionLink;
        assignment.status = 'submitted';
        await assignment.save();
        res.json({ success: true, assignment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
});

//Route 5: Evaluate Task (Admin) PUT /api/tasks/evaluate/:assignmentId
router.put('/evaluate/:assignmentId', fetchuser, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send({ error: "Access denied" });
    try {
        const assignment = await TaskAssignment.findById(req.params.assignmentId);
        if (!assignment) return res.status(404).send({ error: "Assignment not found" });
        assignment.feedback = req.body.feedback;
        assignment.stars = req.body.stars;
        assignment.status = 'evaluated';
        await assignment.save();
        res.json({ success: true, assignment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
});

//Route 6: Get All Submissions for a Task (Admin) GET /api/tasks/:taskId/submissions
router.get('/:taskId/submissions', fetchuser, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send({ error: "Access denied" });
    try {
        const submissions = await TaskAssignment.find({ task: req.params.taskId })
            .populate('intern', 'name email');
        res.json({ success: true, submissions });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
});

// Route 7: Get all interns with their task counts (Admin only) GET /api/admin/interns
router.get('/admin/interns', fetchuser, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send({ error: "Access denied" });
    try {
        // Get all interns
        const interns = await User.find({ isAdmin: false }).select('_id name email').lean();

        // For each intern, count assignments by status
        const result = await Promise.all(interns.map(async intern => {
            const assignments = await TaskAssignment.find({ intern: intern._id }).select('status');
            const counts = { pending: 0, submitted: 0, evaluated: 0, total: assignments.length };
            assignments.forEach(a => {
                if (a.status === 'pending') counts.pending++;
                else if (a.status === 'submitted') counts.submitted++;
                else if (a.status === 'evaluated') counts.evaluated++;
            });
            return { ...intern, counts };
        }));

        res.json({ interns: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;