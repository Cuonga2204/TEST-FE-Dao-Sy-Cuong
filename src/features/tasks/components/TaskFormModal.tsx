import { useEffect, useState } from "react";
import {
  App,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useAppDispatch } from "@/store/hooks";
import { addTask, updateTask, type NewTaskInput } from "../slice/tasksSlice";
import type { Task } from "@/types/task";
import {
  DEFAULT_TASK_PRIORITY,
  DEFAULT_TASK_STATUS,
  PRIORITY_LABEL,
  STATUS_LABEL,
  TASK_ASSIGNEE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TASK_TAGS_MAX_COUNT,
  TASK_TITLE_MAX_LENGTH,
  TASK_TITLE_MIN_LENGTH,
} from "@/constant/task";
import { DATE_FORMAT, MODAL_WIDTH } from "@/constant/constant";

type FormValues = Omit<NewTaskInput, "dueDate"> & { dueDate?: Dayjs };

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
}

export default function TaskFormModal({ open, task, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const isEdit = task !== null;
  const [submittable, setSubmittable] = useState(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    if (!open) return;
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values, open]);

  useEffect(() => {
    if (!open) return;
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
        tags: task.tags,
      });
    } else {
      form.resetFields();
    }
  }, [open, task, form]);

  const handleSubmit = async () => {
    let values: FormValues;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }

    const payload: NewTaskInput = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      status: values.status,
      priority: values.priority,
      assignee: values.assignee?.trim() || undefined,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      tags: values.tags?.length ? values.tags : undefined,
    };

    if (isEdit && task) {
      dispatch(updateTask({ id: task.id, ...payload }));
      message.success("Đã cập nhật task");
    } else {
      dispatch(addTask(payload));
      message.success("Đã tạo task mới");
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Chỉnh sửa task" : "Thêm task mới"}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? "Lưu" : "Tạo"}
      cancelText="Huỷ"
      width={MODAL_WIDTH}
      maskClosable={false}
      forceRender
      okButtonProps={{ disabled: !submittable }}
    >
      <Form
        form={form}
        layout="vertical"
        validateTrigger={["onBlur", "onChange"]}
        initialValues={{
          status: DEFAULT_TASK_STATUS,
          priority: DEFAULT_TASK_PRIORITY,
        }}
        className="pt-2"
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            { required: true, whitespace: true, message: "Vui lòng nhập tiêu đề" },
            {
              min: TASK_TITLE_MIN_LENGTH,
              message: `Tiêu đề tối thiểu ${TASK_TITLE_MIN_LENGTH} ký tự`,
            },
            {
              max: TASK_TITLE_MAX_LENGTH,
              message: `Tiêu đề tối đa ${TASK_TITLE_MAX_LENGTH} ký tự`,
            },
          ]}
        >
          <Input placeholder="Nhập tiêu đề task" allowClear />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[
            {
              max: TASK_DESCRIPTION_MAX_LENGTH,
              message: `Mô tả tối đa ${TASK_DESCRIPTION_MAX_LENGTH} ký tự`,
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Mô tả chi tiết (tuỳ chọn)"
            allowClear
            showCount
            maxLength={TASK_DESCRIPTION_MAX_LENGTH}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select
                options={TASK_STATUSES.map((s) => ({
                  value: s,
                  label: STATUS_LABEL[s],
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="priority"
              label="Độ ưu tiên"
              rules={[{ required: true, message: "Chọn độ ưu tiên" }]}
            >
              <Radio.Group>
                {TASK_PRIORITIES.map((p) => (
                  <Radio.Button key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="assignee"
              label="Người được giao"
              rules={[
                {
                  max: TASK_ASSIGNEE_MAX_LENGTH,
                  message: `Tối đa ${TASK_ASSIGNEE_MAX_LENGTH} ký tự`,
                },
              ]}
            >
              <Input
                placeholder="Tên người phụ trách"
                allowClear
                maxLength={TASK_ASSIGNEE_MAX_LENGTH}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="dueDate" label="Hạn chót">
              <DatePicker className="w-full" format={DATE_FORMAT} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="tags"
          label="Tags"
          rules={[
            {
              validator: (_, value: string[] | undefined) => {
                if (value && value.length > TASK_TAGS_MAX_COUNT) {
                  return Promise.reject(
                    new Error(`Tối đa ${TASK_TAGS_MAX_COUNT} tag`),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Select mode="tags" placeholder="Nhấn Enter để thêm tag" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
