// Use this file only as a guide for first steps. Delete it when you have added your own routes files.
// For a detailed explanation regarding each routes property, visit:
// https://mocks-server.org/docs/get-started-routes

const TASKS = [
  {
    id: 1,
    task: 'Wash clothes',
    status: 'pending',
  },
  {
    id: 2,
    task: 'Take the dogs for a walk',
    status: 'completed',
  },
];

module.exports = [
  {
    id: 'get-tasks', // id of the route
    url: '/api/tasks', // url in express format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: {
          status: 200, // status to send
          body: TASKS, // body to send
        },
      },
      {
        id: 'error', // id of the variant
        response: {
          status: 400, // status to send
          body: {
            // body to send
            message: 'Error',
          },
        },
      },
    ],
  },
  {
    id: 'add-task', // id of the route
    url: '/api/add-tasks', // url in express format
    method: 'POST', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: (req, res) => {
          let data = req.body;
          data['id'] = TASKS.length + 1;
          TASKS.push(data);
          if (data) {
            res.status(200);
            res.send(TASKS);
          } else {
            res.status(404);
            res.send({
              message: 'Task not added',
            });
          }
        },
      },
    ],
  },
  {
    id: 'edit-task', // id of the route
    url: '/api/edit-task', // url in express format
    method: 'PUT', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: (req, res) => {
          let data = req.body;
          const task = TASKS.find(
            (taskData) => taskData.id === Number(data.id)
          );
          let index = TASKS.findIndex(function (indx) {
            return indx.id === task.id;
          });
          TASKS[index] = data;

          if (data) {
            res.status(200);
            res.send(TASKS);
          } else {
            res.status(404);
            res.send({
              message: 'Task not edited',
            });
          }
        },
      },
    ],
  },
  {
    id: 'delete-task', // id of the route
    url: '/api/delete-task', // url in express format
    method: 'POST', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        response: (req, res) => {
          let data = req.body;
          const task = TASKS.find(
            (taskData) => taskData.id === Number(data.id)
          );

          let index = TASKS.findIndex(function (indx) {
            return indx.id === task.id;
          });

          TASKS.splice(index, 1);
          if (data) {
            res.status(200);
            res.send(TASKS);
          } else {
            res.status(404);
            res.send({
              message: 'Task not edited',
            });
          }
        },
      },
    ],
  },
];
