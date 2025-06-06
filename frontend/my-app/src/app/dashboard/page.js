// 05/22/2025: Changes to incorporate JWT into the page's backend calls were modeled after changes to the analogous contact/page.js

// app/dashboard/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from "next/link";
import styles from './dashboard.module.css';

export default function JobDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has a token, and redirect to login screen if not
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }

    async function fetchJobs() {
      // Check if the user still has a token, in case the token has expired or has been deleted
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('https://localhost:7091/api/jobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        // Catches authorization errors
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  async function handleDelete(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`https://localhost:7091/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
      });

      // Catches authorization errors
        if (res.status === 401) {
          router.push('/login');
          return;
        }

      // Catches database-related errors
      if (!res.ok) {
        throw new Error('Failed to delete job');
      }

      // Remove the deleted job from the state
      setJobs((prevJobs) => prevJobs.filter(job => job.id !== id));
    } catch (error) {
      console.error(error);
      alert('Error deleting job');
    }
  }

  function handleEdit(id) {
    router.push(`/dashboard/edit/${id}`);
  }

  function handleAdd() {
    router.push(`/dashboard/add/`);
  }

  async function handleUrcooked(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('https://localhost:7091/api/grok/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId: id })
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to mark job as cooked');
      }

      const msg = await res.text();
      alert(msg);  // or however you want to show it
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }


  // Converts a list of skills into a string of comma-separated skills
  function skillListToSkillString(skills) {
    var skillString = '';
    for (var i = 0; i < skills.length; i++){
      skillString+=skills[i];
      if (i < skills.length - 1) {
        skillString+= ', ';
      }
    }
    return skillString;
  }
  
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>Dashboard</h1>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <div>
          <nav className={styles.ctas} style={{marginBottom: "1.5rem"}}>
              <Link href="/profile" className={styles.buttonLink}> View Profile </Link>
          </nav>

          <h2>Job Applications</h2>

          </div>
          <div className={styles.buttonRow}>
            <button className={styles.buttonFunction} onClick={() => router.push('/contact')}>
              Contacts
            </button>
            <button className={styles.buttonLink} onClick={() => handleAdd()}>
              Add Job
            </button>
        </div>
        
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th>Skills</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(({ id, company, jobTitle, dateApplied, status, contact, skills }) => (
              <tr key={id}>
                <td>{company}</td>
                <td>{jobTitle}</td>
                <td>{status}</td>
                <td>{dateApplied}</td>
                <td>{skillListToSkillString(skills)}</td>
                <td>{contact}</td>
                <td>
                  <button className={styles.cookedButton} style={{ marginRight: '0.5rem' }} onClick={() => handleUrcooked(id)}>
                    urCOOKED
                  </button>
                  <button className={styles.cookedButton} style={{ marginRight: '0.5rem' }} onClick={() => handleEdit(id)}>
                    Edit
                  </button>
                  <button className={styles.cookedButton} onClick={() => handleDelete(id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <nav className={styles.ctas}>
        <Link href="/" className={styles.buttonFunction}>
          Back to Home
        </Link>
      </nav>
    </main>
  );
}
