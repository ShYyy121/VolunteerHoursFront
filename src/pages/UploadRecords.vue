
<template>

  <v-container>

    <v-card>
      <v-card-title>
        <h2>筛选上传记录</h2>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="5">
            <v-select
              v-model="selectedCollege"
              :items="colleges"
              label="选择学院"
              item-text="name"
              item-value="name"
            ></v-select>
          </v-col>

          <v-col cols="3">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedStartDate"
                  label="开始日期"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                @input="updateStartDate"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="3">
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedEndDate"
                  label="结束日期"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                @input="updateEndDate"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <!-- 筛选按钮触发下载 -->
          <v-col cols="1" class="d-flex align-self-center">
            <v-btn color="primary" @click="downloadFilteredRecords">筛选并下载</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-data-table
          :headers="headers"
          :items="records"
          item-value="id"
          show-select
          v-model="selectedRecords"
          class="elevation-1"
          @update:selected="onRecordsSelected"
        >
          <template v-slot:item.upload_time="{ item }">
            {{ formatDate(item.upload_time) }}
          </template>
        </v-data-table>


      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: {NavBar},
  data() {
    return {
      colleges: [], // 存储学院列表
      selectedCollege: "", // 选中的学院
      startDate: null, // 开始日期
      endDate: null, // 结束日期
      records: [], // 记录数据
      selectedRecords: [], // 用于存储用户选择的记录
      menu1: false, // 控制日期选择菜单1
      menu2: false, // 控制日期选择菜单2
      headers: [
        // { key: "id", title: "ID" },
        {
          align: "start",
          key: "username",
          sortable: true,
          title: "用户名",
        },
        { key: "upload_time", title: "上传时间" },
        { key: "file_name", title: "文件名" },
        { key: "record_count", title: "记录数量" },
        { key: "status", title: "状态" },
      ],
    };
  },
  computed: {
    formattedStartDate() {
      return this.startDate ? this.startDate.toLocaleDateString("zh-CN") : "";
    },
    formattedEndDate() {
      return this.endDate ? this.endDate.toLocaleDateString("zh-CN") : "";
    },
  },
  methods: {
    async fetchColleges() {
      try {
        const response = await fetch("http://localhost:5000/colleges");
        const data = await response.json();
        this.colleges = data;
      } catch (error) {
        console.error("获取学院失败:", error);
      }
    },
      onRecordsSelected(selected) {
    // 调试代码，查看选中的记录
    console.log('选中的记录:', selected);
    this.selectedRecords = selected;
  },
    async InitRecords() {
      const params = new URLSearchParams({
        start_time: this.startDate ? this.startDate.toISOString() : "",
        end_time: this.endDate ? this.endDate.toISOString() : "",
        college: this.selectedCollege || "",
      }).toString();

      try {
        const response = await fetch(
          `http://localhost:5000/upload-records?${params}`
        );
        const data = await response.json();
        this.records = data;
        console.log(this.records);
      } catch (error) {
        console.error("获取上传记录失败:", error);
      }
    },
    downloadFilteredRecords() {
    if (this.selectedRecords.length === 0) {
      alert("请选择至少一条记录");
      console.log(this.selectedRecords)
      return;
    }
    // console.log(this.selectedRecords)
    const selectedIds = this.selectedRecords.map(record => record.id); // 获取所选记录的 id

    const params = new URLSearchParams({
      start_time: this.startDate ? this.startDate.toISOString() : "",
      end_time: this.endDate ? this.endDate.toISOString() : "",
      college: this.selectedCollege || "",
      selected_ids: this.selectedRecords, // 将所选id作为参数传递给后端
    }).toString();

    // 使用 window.location.href 触发文件下载
    const downloadUrl = `http://localhost:5000/filter-upload-records?${params}`;
    window.location.href = downloadUrl;
  },
    updateStartDate() {
      this.menu1 = false; // 关闭菜单
    },
    updateEndDate() {
      this.menu2 = false; // 关闭菜单
    },
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return new Date(date).toLocaleDateString("zh-CN", options);
    },
  },
  mounted() {
    // 初始化时加载学院列表和所有记录
    this.fetchColleges();
    this.InitRecords(); // 初始化时加载所有记录
  },
};
</script>
