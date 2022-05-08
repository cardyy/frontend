import React from 'react';

export default function Center_cards_component(props) {
  return (
    <div className='parent perspective'>
      <span>
        <ul className='child hand'>
          {props.centerCards.map((card, index) => (
            <li key={index}>
              <img
                src={require(`../../assets/cards/${card}.png`)}
                alt=''
                className='img'
              />
            </li>
          ))}
        </ul>
      </span>
    </div>
  );
}
