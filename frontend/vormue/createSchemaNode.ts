import { VNodeData } from 'vue';
import { defineComponent, h } from '@nuxtjs/composition-api';

interface Props {
  value: any;
  error: string;
  component: string;
  componentOptions: { [k: string]: any };
  label: string;
}

export default defineComponent<Props>({
  name: 'VormueField',
  props: {
    value: {
      type: [String, Number, Boolean, Array, Object],
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    component: {
      type: [String, Object],
      required: true,
    },
    componentOptions: {
      type: Object,
      default: () => {},
    },
    label: {
      type: String,
      required: true,
    },
  },

  setup(props, ctx) {
    return () => {
      const fieldData: VNodeData = {
        props: {
          message: props.error,
          type: props.error ? 'is-danger' : '',
          label: props.label,
        },
      };

      const inputData: VNodeData = {
        attrs: {
          ...props.componentOptions,
        },
        props: {
          value: props.value,
        },
        on: {
          input(val: any) {
            ctx.emit('input', val);
          },
        },
      };

      return h('b-field', fieldData, [h(props.component, inputData)]);
    };
  },
});
