<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sm bg-primary">
      <q-input
        v-model="newTask"
        @keyup.enter="addBtn"
        filled
        bg-color="white"
        class="col"
        placeholder="Add Task"  dense
      >

        <template v-slot:append>
          <q-btn round dense flat icon="add" @click="addBtn($event)" />
        </template>
      </q-input>

    </div>

    <q-list
        class="bg-white"
        separator
        bordered>

      <!--  1개 항목이 q-item -->
      <q-item
        v-ripple
        v-for="(task, index) in tasks"
        :key="task.title"
        clickable
        :class="{'done bg-blue-1': task.done}"
        @click="task.done = !task.done">

        <!--   dheckbox자체가 클릭이벤트를 가지고 있어서 no-pointer-event-->
        <q-item-section avatar>
          <q-checkbox
            v-model="task.done"
            class="no-pointer-events"
            color="primary" />
         </q-item-section>

           <q-item-section>
            <q-item-label class="taskTitle">{{task.title}}</q-item-label>
          </q-item-section>

        <q-item-section>
<!--          <q-btn flat round color="primary" icon="delete"  @click.stop="deleteBtn(task)"/>-->
          <q-btn flat round color="primary" icon="delete"
                 @click.stop="deleteBtn(index)"/>
        </q-item-section>

      </q-item>

    </q-list>
    <div  v-if="tasks.length==0" class="no-tasks absolute-center">
      <q-icon name="check" size="100px" color="primary"/>
      <div class="text-h5 text-primary text-center">
        <span >NO TASKS !! </span>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data(){
    return {
      newTask:'',
      tasks:[
        // {
        //   title:'get bananas',
        //   done:false
        // },
        // {
        //   title:'improve skills',
        //   done:false
        // },
        // {
        //   title:'seek a better life',
        //   done:false
        // },
        // {
        //   title:'subject to be great',
        //   done:false
        // }
      ]
    }
  }, //data()
  methods:{
    showTasks(){
      return this.tasks;
    },
      //console.log(' deleteTitle >>>',  deleteTitle.target.closest('.q-item').querySelector('.taskTitle').textContent);
      // let title = deleteTitle.querySelector('taskTitle').textContent;
     // const result = this.tasks.find(a=>a === deleteTask );
    deleteBtn(index){
     //this.tasks = this.tasks.filter(a=>a !==  deleteTask);

        this.$q.dialog({
          title: 'Confirm',
          message: 'really delete?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          // console.log('>>>> OK')
          this.tasks.splice(index,1); // Danny Connell방법
          !this.$q.notify('Task Deleted')
        })
    },
     addBtn(event){
      // const getTitle = event;
      // console.log('getTitle  >>>',  getTitle);
      this.tasks.push({title: this.newTask, done:false });
      this.newTask='';
     }
  }

}
</script>
<style lang="scss">
.done{
  .q-item__label{
    text-decoration: line-through;
    color:#bbb;
  }
}
.no-tasks{
  opacity: 0.5;
}
</style>
