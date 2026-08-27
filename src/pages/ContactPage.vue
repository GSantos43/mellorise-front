<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  comment: ''
})

const wasSubmitted = ref(false)
const { t } = useI18n({ useScope: 'global' })

function submitContact() {
  wasSubmitted.value = true
}
</script>

<template>
  <div class="mellorise-contact color-scheme-1 gradient">
    <div class="contact mellorise-contact__inner page-width page-width--narrow section-contact-form-padding">
      <h1 class="title title-wrapper--no-top-margin inline-richtext h1">
        {{ t('contact.title') }}
      </h1>

      <form id="ContactForm" class="isolate" @submit.prevent="submitContact">
        <h2 v-if="wasSubmitted" class="form-status form-status-list form__message" tabindex="-1" autofocus>
          {{ t('contact.status') }}
        </h2>

        <div class="contact__fields">
          <div class="field">
            <input
              id="ContactForm-name"
              v-model="form.name"
              class="field__input"
              autocomplete="name"
              type="text"
              name="contact[Name]"
              :placeholder="t('contact.name')"
            >
            <label class="field__label" for="ContactForm-name">{{ t('contact.name') }}</label>
          </div>
          <div class="field field--with-error">
            <input
              id="ContactForm-email"
              v-model="form.email"
              autocomplete="email"
              type="email"
              class="field__input"
              name="contact[email]"
              spellcheck="false"
              autocapitalize="off"
              aria-required="true"
              :placeholder="t('contact.emailRequired')"
              required
            >
            <label class="field__label" for="ContactForm-email">
              {{ t('contact.email') }}
              <span aria-hidden="true">*</span>
            </label>
          </div>
        </div>
        <div class="field">
          <input
            id="ContactForm-phone"
            v-model="form.phone"
            type="tel"
            class="field__input"
            autocomplete="tel"
            name="contact[Phone number]"
            pattern="[0-9\\-]*"
            :placeholder="t('contact.phone')"
          >
          <label class="field__label" for="ContactForm-phone">{{ t('contact.phone') }}</label>
        </div>
        <div class="field">
          <textarea
            id="ContactForm-body"
            v-model="form.comment"
            rows="10"
            class="text-area field__input"
            name="contact[Comment]"
            :placeholder="t('contact.comment')"
          ></textarea>
          <label class="form__label field__label" for="ContactForm-body">
            {{ t('contact.comment') }}
          </label>
        </div>
        <div class="contact__button">
          <button type="submit" class="button">
            {{ t('contact.send') }}
          </button>
        </div>
      </form>
    </div>
  </div>

</template>

<style>
.section-contact-form-padding {
  padding-top: 69px;
  padding-bottom: 54px;
}

@media screen and (min-width: 750px) {
  .section-contact-form-padding {
    padding-top: 92px;
    padding-bottom: 72px;
  }
}

</style>
