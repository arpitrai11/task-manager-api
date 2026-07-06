const AuthForm = ({ mode, form, setForm, loading, onSubmit, error }) => (
  <section className="card auth-card">
    <div className="auth-toggle">
      <button className={mode === 'login' ? 'active' : ''} onClick={() => setForm((current) => ({ ...current, mode: 'login' }))}>
        Login
      </button>
      <button className={mode === 'register' ? 'active' : ''} onClick={() => setForm((current) => ({ ...current, mode: 'register' }))}>
        Register
      </button>
    </div>

    {error ? <div className="error-box">{error}</div> : null}

    <form onSubmit={onSubmit} className="auth-form">
      {mode === 'register' ? (
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
        />
      ) : null}
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
      />
      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
    <div id="google-signin" className="google-signin"></div>
  </section>
);

export default AuthForm;