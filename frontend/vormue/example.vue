<template>
  <BaseModal :title="`Kategorie ${title}`" @close="$emit('close')">
    <VormueForm v-model="category" :schema="schema" @submit="saveHandler" />
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import { NAMESPACE, CategoriesState } from '@/store/categories';
import { Category } from '@/types/entities';
import VormueForm from '@/utils/vormue';
import { string } from 'yup';
import { SchemaNode } from '@/utils/vormue/types';
import AsyncSelect from '@/components/Forms/InputComponents/AsyncSelect.vue';
import BaseModal from '@/components/Modals/Base.vue';

const { useState } = createNamespacedHelpers<CategoriesState>(NAMESPACE);

const schema: SchemaNode[] = [
  {
    component: 'b-input',
    name: 'name',
    label: 'Name',
    schema: string().required().max(25),
  },
  {
    component: 'b-input',
    name: 'description',
    label: 'Beschreibung',
    schema: string().required(),
  },
  {
    component: AsyncSelect,
    name: 'categoryGroupId',
    componentOptions: {
      name: NAMESPACE,
    },
    label: 'Kategoriegruppe wählen',
    schema: string().required(),
  },
];




interface Props {
  type: string;
  onSave: (category: Category) => Promise<void>;
}

export default defineComponent<Props>({
  name: 'CategoryGroupFormModal',

  components: {
    BaseModal,
    VormueForm,
  },

  props: {
    type: {
      type: String,
      default: 'update',
    },
    onSave: {
      type: Function,
      required: true,
    },
  },

  setup(props, ctx) {
    const title = props.type === 'create' ? 'erstellen' : 'bearbeiten';
    let category = ref<Category>({
      name: '',
      description: '',
      categoryGroupId: '',
    });

    if (props.type === 'update') {
      const { selected } = useState(['selected']);
      if (selected.value) {
        category = ref<Category>({
          ...selected.value,
        });
      }
    }

    return {
      title,
      category,
      schema,
      saveHandler: async () => {
        await props.onSave(category.value);
        ctx.emit('close');
      },
    };
  },
});
</script>
