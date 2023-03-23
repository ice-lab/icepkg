import { jsx as _jsx } from 'react/jsx-runtime';
import './index.css';

const Button = (props) => {
    const { type = 'default' } = props;
    const typeCssSelector = {
        primary: 'pkg-btn-primary',
        default: 'pkg-btn-default',
    };
    return /* #__PURE__ */ _jsx('button', {
        className: `pkg-btn ${typeCssSelector[type] || ''}`,
        children: props.children,
    });
};
export default Button;
