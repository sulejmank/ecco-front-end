<template>
<div class="modal">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" v-on:click="dissmis">&times;</button>
      </div>
      <!-- Modal body -->
      <div class="modal-body p-0">
       <iframe :src="iframeUrl" v-if="displayFrame" width="100%" height="623px" frameborder='0'></iframe>
        <!-- <pre v-if="displayFrame">{{docnam}}</pre> -->
      </div>
    </div>
  </div>
</div>
</template>
<script>
// import Room from '@/components/Room'
import Api from '@/services/api'

export default {
  name: 'DocumentPreview',
  props: {
    id: {
      type: Number
    }
  },
  components: {
    // 'room': Room
  },
  data () {
    return {
      isPassanger: true,
      displayFrame: false,
      documentName: '/temp/bill.docx',
      api: new Api()
    }
  },
  asyncComputed: {
    async iframeUrl () {
      var response = await this.api.getBillPreviewInWordDocument(this.id)
      if (process.env.NODE_ENV === 'production') {
        return 'https://view.officeapps.live.com/op/embed.aspx?src=' + process.env.ROOT_URL + '/temp/downloads/' + response.data.docname
      } else {
        return 'https://view.officeapps.live.com/op/embed.aspx?src=https://api.ecco.rs/temp/bill.docx'
      }
    }
  },
  methods: {
    dissmis () {
      this.api.removePreviewBill(this.id).then(res => {
        this.$emit('closeDocumentPreview')
      })
    },
    getBillPreview () {
      this.api.getBillPreviewInWordDocument(this.id).then(res => {
        this.displayFrame = true
        this.documentName = res.data.docname
      })
    }
  },
  mounted () {
    console.log('Mounted')
    this.getBillPreview()
  }
}
</script>
<style>
.modal{
  display:block;
}
.modal-body .main-content{
  min-height:0 !important;
}
</style>
