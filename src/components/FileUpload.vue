<template>
  <v-container>
    <v-card>
      <v-card-title class="headline">文件上传</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="file"
          :show-size="true"
          @update:modelValue="onFileSelected"
          :show-size="true"
          label="选择文件"
          prepend-icon="mdi-paperclip"
          accept=".xlsx"
          @change="onFileChange"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="fileName in fileNames" :key="fileName">
              <v-chip
                class="me-2"
                color="primary"
                size="small"
                label
              >
                {{ fileName }}
              </v-chip>
            </template>
          </template>
        </v-file-input>
        <v-btn @click="uploadFiles" color="primary" :disabled="!file">上传</v-btn>
      </v-card-text>
      <v-card-actions>
        <v-alert v-if="uploadStatus" :type="statusType">{{ uploadStatus }}</v-alert>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      fileNames: [],
      uploadStatus: '',
      statusType: '',
    };
  },
  methods: {
    onFileSelected(value) {
      if (value instanceof File) {
        this.fileNames = [value.name];
      } else if (Array.isArray(value)) {
        this.fileNames = value.map(file => file.name);
      }
    },
    onFileChange(event) {
      this.file = event;
      console.log('Selected file:', this.file);
    },
    async uploadFiles() {
      const formData = new FormData();
      formData.append('file', this.file);

      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.status === 'success') {
          this.uploadStatus = `成功上传 ${data.success_count} 条记录，${data.duplicate_count} 条重复记录。`;
          this.statusType = 'success';
        } else {
          this.uploadStatus = '上传失败，请重试。';
          this.statusType = 'error';
        }
      } catch (error) {
        this.uploadStatus = '网络错误，请重试。';
        this.statusType = 'error';
      }
    },
  },
};
</script>

<style scoped>
.headline {
  text-align: center;
}
.file-names {
  margin-top: 10px;
}
</style>
