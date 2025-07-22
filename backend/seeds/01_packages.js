exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('packages').del();
  await knex('packages').insert([
    {
      name: 'New User Plan',
      price: 2500,
      job_post_limit: 5,
      description: 'Discounted plan for new users. 1 or 5 job postings, company listed, application sent to inbox or URL, job fair booth, basic job statistics.',
      features: JSON.stringify([
        '1 or 5 job postings',
        'Company listed on ethiojobs.net',
        'Application sent straight to your inbox or preferred URL',
        'Job fair booth during the Annual Milk Run',
        'Basic job statistics'
      ])
    },
    {
      name: 'Lite Plan',
      price: 5000,
      job_post_limit: 5,
      description: 'Lite plan for small employers. 1 or 5 job postings, company listed, application sent to inbox or URL, job fair booth, basic job statistics.',
      features: JSON.stringify([
        '1 or 5 job postings',
        'Company listed on ethiojobs.net',
        'Application sent straight to your inbox or preferred URL',
        'Job fair booth during the Annual Milk Run',
        'Basic job statistics'
      ])
    },
    {
      name: 'Pro Plan',
      price: 22000,
      job_post_limit: 10,
      description: 'Pro plan for growing employers. 10 job postings, full ATS, reporting, account manager, customizable profile.',
      features: JSON.stringify([
        '10 job postings',
        'Full ATS functionality',
        'Complete reporting and analytics',
        'Dedicated account manager for all fresh graduate hiring needs during the Annual Milk Run',
        'Customizable company profile'
      ])
    },
    {
      name: 'Plus Plan',
      price: 45000,
      job_post_limit: 50,
      description: 'Plus plan for larger employers. 50 job postings, full ATS, jobs promoted, featured article, branded career page.',
      features: JSON.stringify([
        '50 job postings',
        'Full ATS functionality',
        'Jobs promoted on ethiojobs social media channels',
        'Featured article on Ethiojobs blog',
        'Fully branded career page on ethiojobs.net'
      ])
    },
    {
      name: 'Premium Plan',
      price: 100000,
      job_post_limit: 200,
      description: 'Premium plan for top employers. 200 job postings, full ATS, targeted email, featured employer, candidate vetting/reporting.',
      features: JSON.stringify([
        '200 job postings',
        'Full ATS functionality',
        'Jobs promoted with targeted email campaigns',
        'Featured employer on ethiojobs.net and dereja.com',
        'Candidate vetting and reporting throughout the Annual Milk Run'
      ])
    }
  ]);
}; 