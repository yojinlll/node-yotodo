const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  const list = await db.read()
  list.push({ title, done: false })
  await db.write(list)
}
module.exports.clear = async (title) => {
  await db.write([])
}
module.exports.showAll = async () => {
  const list = await db.read()
  printTasks(list)
}




function askForAction(list, index){
  const taskAction = {
    markAsDone(list, index){
      list[index].done = true
      db.write(list)
    },
    markAsUndone(list, index){
      list[index].done = false
      db.write(list)
    },
    updateTitle(list, index){
      inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '请创建新的任务名',
        default: list[index].title
      }).then(answers3 => {
        console.log('操作成功')
        list[index].title = answers3.title
        db.write(list)
      })
    },
    remove(list ,index){
      list.splice(index, 1)
      db.write(list)
      console.log('删除成功');
    },
  }
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: '请选择操作',
    choices: [
      { name: '退出', value: 'quit' },
      { name: '已完成', value: 'markAsDone' },
      { name: '未完成', value: 'markAsUndone' },
      { name: '改标题', value: 'updateTitle' },
      { name: '删除', value: 'remove' },
    ]
  }).then(answers2 => {
    taskAction[answers2.action](list, index)
  })
}

function askForCreateTask(list){
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '任务名',
  }).then(answers4 => {
    list.push({ title: answers4.title, done: false })
    db.write(list)
    console.log(`${answers4.title} - 任务创建成功`);
  })
}

function printTasks(list){
  return inquirer.prompt({
    type: 'list',
    name: 'index',
    message: '请选择想操作的任务',
    choices: [
      { name: '退出', value: -1 },
      ...list.map((task, index) => { return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString() } }),
      { name: '+ 创建任务', value: -2 }
    ]
  }).then(answers => {
    const index = parseInt(answers.index)
    if (index >= 0) {
      askForAction(list, index)
    } else if (index === -2) {
      askForCreateTask(list)
    }
  })
}
