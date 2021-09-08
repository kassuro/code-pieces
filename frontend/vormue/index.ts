import { VNodeData, VNode } from 'vue';
import { defineComponent, h, ref } from '@nuxtjs/composition-api';
import { object, setLocale, ValidationError } from 'yup';
import { ErrorBag, SchemaNode } from './types';
import createSchemaNode from './createSchemaNode';
import { parseErrors } from './utils';
import locales from './locales';
import { createSubmitButton } from './submitButton';

interface Props {
  schema: SchemaNode[];
  value: any;
  submitLabel: string;
  buttonType: string;
  buttonPosition: string;
}

setLocale(locales);

export default defineComponent<Props>({
  name: 'VormueForm',
  props: {
    schema: {
      type: Array,
      required: true,
    },
    value: {
      type: [Object, Number, String, Array],
      required: true,
    },
    submitLabel: {
      type: String,
      default: 'Speichern',
    },
    buttonType: {
      type: String,
      default: 'is-success',
    },
    buttonPosition: {
      type: String,
      default: 'right',
    },
  },

  setup(props, ctx) {
    const errors = ref<ErrorBag>({});
    const validationSchema = object(
      props.schema.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.name]: cur.schema,
        }),
        {},
      ),
    );

    const validateAll = () => {
      try {
        validationSchema.validateSync(props.value, { abortEarly: false });
        return true;
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.value = parseErrors(error);
        }
        return false;
      }
    };

    return () => {
      const formData: VNodeData = {
        on: {
          submit: ($event: Event) => {
            $event.preventDefault();
            if (validateAll()) {
              ctx.emit('submit');
            }
          },
        },
      };

      const children: VNode[] = [];

      props.schema.forEach((schemaNode) => {
        const fieldData: VNodeData = {
          props: {
            component: schemaNode.component,
            componentOptions: schemaNode.componentOptions,
            label: schemaNode.label,
            error: errors.value[schemaNode.name],
            value: props.value[schemaNode.name],
          },
          on: {
            input(val: any) {
              ctx.emit('input', { ...props.value, [schemaNode.name]: val });
            },
          },
        };
        children.push(h(createSchemaNode, fieldData));
      });

      if (ctx.slots.default) {
        children.push(...ctx.slots.default());
      }

      children.push(
        createSubmitButton(
          props.buttonType,
          props.buttonPosition,
          props.submitLabel,
        ),
      );

      return h('form', formData, children);
    };
  },
});
