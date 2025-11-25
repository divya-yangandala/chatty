import PropTypes from 'prop-types';
import '@components/dialog/Dialog.scss';
import Button from '@components/button/Button';

const Dialog = ({ title, showButtons, firstButtonText, secondButtonText, firstBtnHandler, secondBtnHandler }) => {
  return (
    <div className="dialog-container" data-testid="dialog-container">
      <div className="dialog">
        <h4>{title}</h4>
        {showButtons && (
          <div className="btn-container">
            <Button className="btn button cancel-btn" label={secondButtonText} handleClick={secondBtnHandler} />
            <Button className="btn button confirm-btn" label={firstButtonText} handleClick={firstBtnHandler} />
          </div>
        )}
      </div>
    </div>
  );
};

Dialog.propTypes = {
  title: PropTypes.string,
  showButtons: PropTypes.bool,
  firstButtonText: PropTypes.string,
  secondButtonText: PropTypes.string,
  firstBtnHandler: PropTypes.func,
  secondBtnHandler: PropTypes.func
};

export default Dialog;
