import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';

const initialDate = '2022-06-21';

// The app reads the default date when the module loads.
jest.useFakeTimers('modern');
jest.setSystemTime(new Date(`${initialDate}T12:00:00Z`));
const { App } = jest.requireActual<typeof import('./app')>('./app');
jest.useRealTimers();

const originalFetch = global.fetch;
const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

afterEach(() => {
  global.fetch = originalFetch;
});

it('loads the API data and displays every returned train', async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => [
      { train: 9063, date: initialDate, origin: 'London', destination: 'Paris' },
      { train: 9064, date: initialDate, origin: 'Paris', destination: 'London' },
    ],
  });
  render(<App />);
  expect(screen.getByRole('status').textContent).toContain('Loading');
  expect(await screen.findByText('9063')).toBeTruthy();
  expect(screen.getByText('9064')).toBeTruthy();
  expect(fetchMock).toHaveBeenCalledWith(`http://localhost:3000/schedule?date=${initialDate}`);
});

it('requests the selected date and stops requesting trains when the date is cleared', async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => [] });
  render(<App />);
  await screen.findByRole('table', { name: 'Scheduled trains' });

  const picker = screen.getByLabelText('Travel date');
  fireEvent.change(picker, { target: { value: '2022-06-22' } });
  const schedule = await screen.findByRole('table', { name: 'Scheduled trains' });
  expect(within(schedule).queryAllByRole('cell')).toHaveLength(0);
  expect(fetchMock).toHaveBeenLastCalledWith('http://localhost:3000/schedule?date=2022-06-22');

  fetchMock.mockClear();
  fireEvent.change(picker, { target: { value: '' } });
  expect(screen.queryByRole('table')).toBeNull();
  expect(fetchMock).not.toHaveBeenCalled();
});

it('renders an empty alert when an unsuccessful response has invalid JSON', async () => {
  fetchMock.mockResolvedValue({
    ok: false,
    json: jest.fn().mockRejectedValue(new SyntaxError('Invalid JSON')),
  });
  render(<App />);
  expect((await screen.findByRole('alert')).textContent).toBe('');
  expect(screen.queryByRole('table')).toBeNull();
});

it('shows the error message returned by the schedule API', async () => {
  const message = 'No trains are available on this date.';
  fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: message }) });
  render(<App />);
  expect((await screen.findByRole('alert')).textContent).toBe(message);
  expect(screen.queryByRole('table')).toBeNull();
});

it('renders an empty alert and stops loading when the API cannot be reached', async () => {
  fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
  render(<App />);
  expect((await screen.findByRole('alert')).textContent).toBe('');
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.queryByRole('table')).toBeNull();
});