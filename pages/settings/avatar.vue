<template>
  <div>
    <div class="mb-4">
      <UFormGroup label="Current avatar" class="w-full" help="This would be blank by default">
        <UAvatar :src="url" size="3xl"/>
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup label="New avatar" class="w-full" name="avatar"
                  help="After choosing an image click Save to actually upload the new avatar">
        <UInput type="file" ref="fileInput"/>
      </UFormGroup>
    </div>

    <UButton type="submit" color="black" variant="solid" label="Save" :loading="uploading" :disabled="uploading"
             @click="saveAvatar"/>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const {url} = useAvatarUrl();
// We need to get the actual avatar URL
const {toastSuccess, toastError} = useAppToast();

const uploading = ref(false)
const fileInput = ref() // Reference to an input with ref="fileInput" attribute


const saveAvatar = async () => {
  const file = fileInput.value.input.files[0]

  if (!file) {
    toastError({title: 'Select a file to upload first'})
    return
  }


  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`

  try {
    uploading.value = true
    const currentAvatarUrl = user.value.user_metadata?.avatar_url
    const {error} = await supabase.storage.from('avatars').upload(fileName, file)
    if (error) throw error

    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName
      }
    })

    if(currentAvatarUrl) {
      const {error} =  await supabase.storage.from('avatars').remove([currentAvatarUrl]);
      if(error) throw error;
    }

    fileInput.value.input.value = null

    toastSuccess({
      title: 'Avatar uploaded',
    })
  } catch (error) {
    toastError({
      title: 'Error uploading avatar',
      description: error.message
    })
  } finally {
    uploading.value = false
  }
}
</script>