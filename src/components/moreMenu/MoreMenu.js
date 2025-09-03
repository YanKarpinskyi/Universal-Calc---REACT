import Button from '../button/Button';
import moreMenuStyles from './MoreMenu.module.scss';
import calcStyles from '../calculator/Calculator.module.scss';

function MoreMenu({ items, isVisible, id }) {
  return (
    <div
      className={`${moreMenuStyles.more__operations} ${isVisible ? moreMenuStyles['more__operations--visible'] : ''}`}
      id={id}
    >
      {items.map((item) => (
        <Button
          key={item.label}
          label={item.label}
          onClick={item.onClick}
          className={calcStyles.btn}
          id={item.id}
        />
      ))}
    </div>
  );
}

export default MoreMenu;