import { Button, Tooltip } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useThemeMode } from '@/theme/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Chuyển sang sáng' : 'Chuyển sang tối'}>
      <Button
        type="text"
        shape="circle"
        onClick={toggle}
        icon={
          isDark ? (
            <SunOutlined style={{ color: '#fff' }} />
          ) : (
            <MoonOutlined style={{ color: '#fff' }} />
          )
        }
        aria-label="Chuyển đổi giao diện sáng/tối"
      />
    </Tooltip>
  );
}
