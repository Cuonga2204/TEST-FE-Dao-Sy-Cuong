import { memo, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectFilters } from "../slice/tasksSelectors";
import { resetFilters, setFilter } from "../slice/tasksSlice";
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/constant/task";
import { DATE_FORMAT, DELAY_MS } from "@/constant/constant";
import { useDebounce } from "@/hook/useDebounce";

const { RangePicker } = DatePicker;
const { Text } = Typography;

function FilterBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  const [localSearch, setLocalSearch] = useState(filters.searchText);
  const debouncedSearch = useDebounce(localSearch, DELAY_MS);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    dispatch(setFilter({ key: "searchText", value: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    if (filters.searchText === "" && localSearch !== "") {
      setLocalSearch("");
    }
  }, [filters.searchText]);

  const dateRangeValue: [Dayjs, Dayjs] | null = filters.dateRange
    ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]
    : null;

  const handleReset = () => {
    setLocalSearch("");
    dispatch(resetFilters());
  };

  return (
    <Row gutter={[12, 12]} align="bottom">
      <Col xs={24} md={12} lg={6}>
        <Flex vertical gap={4}>
          <Text type="secondary">Tìm kiếm</Text>
          <Input.Search
            allowClear
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề..."
          />
        </Flex>
      </Col>

      <Col xs={24} md={12} lg={6}>
        <Flex vertical gap={4}>
          <Text type="secondary">Trạng thái</Text>
          <Select
            mode="multiple"
            allowClear
            className="w-full"
            placeholder="Tất cả"
            value={filters.status}
            onChange={(v) => dispatch(setFilter({ key: "status", value: v }))}
            options={TASK_STATUSES.map((s) => ({
              value: s,
              label: STATUS_LABEL[s],
            }))}
          />
        </Flex>
      </Col>

      <Col xs={24} md={12} lg={6}>
        <Flex vertical gap={4}>
          <Text type="secondary">Độ ưu tiên</Text>
          <Select
            allowClear
            className="w-full"
            placeholder="Tất cả"
            value={filters.priority}
            onChange={(v) =>
              dispatch(setFilter({ key: "priority", value: v ?? null }))
            }
            options={TASK_PRIORITIES.map((p) => ({
              value: p,
              label: PRIORITY_LABEL[p],
            }))}
          />
        </Flex>
      </Col>

      <Col xs={24} md={12} lg={6}>
        <Flex vertical gap={4}>
          <Text type="secondary">Hạn chót</Text>
          <Flex gap="small">
            <RangePicker
              className="flex-1"
              format={DATE_FORMAT}
              value={dateRangeValue}
              onChange={(range) => {
                if (!range || !range[0] || !range[1]) {
                  dispatch(setFilter({ key: "dateRange", value: null }));
                  return;
                }
                dispatch(
                  setFilter({
                    key: "dateRange",
                    value: [
                      range[0].startOf("day").toISOString(),
                      range[1].endOf("day").toISOString(),
                    ],
                  }),
                );
              }}
            />
            <Button onClick={handleReset}>Reset</Button>
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
}

export default memo(FilterBar);
