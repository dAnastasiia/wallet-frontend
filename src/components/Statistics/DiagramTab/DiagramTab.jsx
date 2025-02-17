import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as id } from 'uuid';
import Chart from '../Chart';
import Table from '../Table';
import s from './DiagramTab.module.scss';

import date from './monthAndYear';
import {
  statisticsActions,
  statisticsOperations,
  statisticsSelectors,
} from '../../../redux/statistics';

function DiagramTab() {
  const [month, setMonth] = useState(date.currentMonth);

  const handleChangeMonth = ({ target: { value } }) => {
    setMonth(value);
  };

  const [year, setYear] = useState(date.currentYear);

  const handleChangeYear = ({ target: { value } }) => {
    setYear(value);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(statisticsOperations.fetchStatistics(month, year));

    return () => {
      dispatch(statisticsActions.resetStatistics());
    };
  }, [dispatch, month, year]);

  const statisticsData = useSelector(statisticsSelectors.getItems);
  const total = useSelector(statisticsSelectors.getBalance);
  const income = useSelector(statisticsSelectors.getIncome);
  const outlay = useSelector(statisticsSelectors.getOutlay);

  const data = statisticsData.map(({ count }) => count);
  const backgroundColor = statisticsData.map(({ color }) => color);
  const label = statisticsData.map(({ name }) => name);

  const chartData = {
    datasets: [
      {
        data,
        backgroundColor,
        borderWidth: 0,
      },
    ],
    labels: label,
  };

  console.log(total);
  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>Statistic</h2>

      <div className={s.wrapper}>
        <div className={s.visualPart}>
          {statisticsData.length > 0 && (
            <h2 className={s.chartTotal}>₴ {total ? total.toFixed(2) : 0}</h2>
          )}
          <Chart data={chartData} />
        </div>

        <div className={s.tablePart}>
          <div className={s.filter}>
            <select
              value={month}
              id="month"
              className={s.dropdown}
              onChange={handleChangeMonth}
            >
              {date.months.map(month => (
                <option value={month} key={id()}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={year}
              id="year"
              className={s.dropdown}
              onChange={handleChangeYear}
            >
              {date.years.map(year => (
                <option value={year} key={id()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {statisticsData.length ? (
            <Table data={statisticsData} income={income} outlay={outlay} />
          ) : (
            <p className={s.warning}>
              Please, add at least one transaction for this month
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default DiagramTab;
