<template>
  <q-page class="bg-grey-3 column">
    <q-list
        class="bg-white"
        separator
        bordered>

      <!--  1개 항목이 q-item -->
      <q-item
        v-ripple
        v-for="task in tasks"
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
          <q-btn flat round color="primary" icon="delete"  @click.stop="deleteBtn(task)"/>
        </q-item-section>

      </q-item>

    </q-list>
  </q-page>
</template>

<script>
export default {
  data(){
    return {
      tasks:[
        {
          title:'get bananas',
          done:false
        },
        {
          title:'improve skills',
          done:false
        },
        {
          title:'seek a better life',
          done:false
        },
        {
          title:'subject to be great',
          done:false
        }
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
    deleteBtn(deleteTask){
     this.tasks = this.tasks.filter(a=>a !==  deleteTask);
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
</style>
