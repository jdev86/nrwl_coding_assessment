import { Routes, Route } from 'react-router-dom';
import styles from './app.module.css';
import { Tickets } from './tickets/tickets';
import { TicketDetails } from './ticketDetails/ticketDetails';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className={styles['app']}>
      <h1>Ticketing App</h1>
      <Routes>
        <Route path="/" element={<Tickets />} />
        {/* Hint: Try `npx nx g component TicketDetails --no-export` to generate this component  */}
        <Route path="/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;
