import PropTypes from 'prop-types';
import '@components/posts/reactions/Reaction.scss';
import { reactionsMap } from '@services/utils/static.data';


const Reaction = ({ handleClick, showLabel = true }) => {
  const reactionList = ['like', 'love', 'wow', 'happy', 'sad', 'angry'];
  return (
    <div className="reactions" data-testid="reactions">
      <ul>
        {reactionList.map((reaction, index) => (
          <li key={index} onClick={() => handleClick(reaction)} data-testid="reaction">
            {showLabel && <label>{reaction}</label>}
            <img src={reactionsMap[reaction]} alt='' />
          </li>
        ))}
      </ul>
    </div>
  )
}

Reaction.propTypes = {
  handleClick: PropTypes.func,
  showLabel: PropTypes.bool
}

export default Reaction;
