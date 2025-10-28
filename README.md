# Galaxy Acceptance Tests
Playwright tests to confirm Galaxy is functioning as expected after deployment.

The `tests` directory contains Playwright test scripts that verify Galaxy functionality across two deployment scenarios:
- **Terra-hosted Galaxy**: Tests that manage the full lifecycle on [Terra](https://app.terra.bio) (launch, test, shutdown)
- **External Galaxy**: Tests against a standalone Galaxy instance running on a known URL

A complete end-to-end Terra test flow includes:

1. Launching a new Galaxy instance on Terra
2. Running functional tests:
   - Create, rename, and delete a history
   - Upload data by pasting text into the upload dialog
   - Upload datasets and run the `fastp` tool
   - Upload datasets, a reference genome, and run a variant calling workflow
3. Pausing the Galaxy instance (preserving disks)
4. Resuming and verifying data persistence
5. Shutting down and cleaning up resources

Test files are organized into two categories: **Terra tests** (platform operations) and **Galaxy tests** (application functionality).

## Terra tests

The test files that target Terra functionality are:

- `login.spec.ts`<br/>performs the login flow to authenticate with a Google account.
- `launch.spec.ts`<br/>launches a Galaxy instance with the default configuration.
- `open.spec.ts`<br/>opens Galaxy in a new browser tab
- `pause.spec.ts`<br/>deletes the Galaxy instance but leaves the disks intact.
- `shutdown.spec.ts`<br/>deletes the Galaxy instance and persistent disks.

## Galaxy tests

The test files that target Galaxy functionality:

- `history.spec.ts`<br/>create, rename, and delete a history
- `paste.spec.ts`<br/>upload text by pasting into the upload dialog
- `fastp.spec.ts`<br/>upload two datasets and run the `fastp` tool
- `variant.spec.ts`<br/>[WIP] upload datasets, a workflow, and runs the workflow

## Administrative functions

Administrative test utilities:

- `auth.setup.ts`<br/>Authenticates to Terra and saves session to `.auth/user.json`. This allows subsequent tests to bypass Google OAuth login and avoid captchas. Run in headed mode: `npx playwright test tests/auth.setup.ts --headed`. For CI/CD, update the GitHub secret `USER_JSON` with the contents of this file.
- `cleanup.spec.ts`<br/>Cleans up orphaned persistent disks that sometimes linger after test failures.

## Running the tests locally

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   npx playwright install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file (or set environment variables) with the following:

   **For Terra testing:**
   ```bash
   TERRA_URL=test          # Options: 'test'/'dev', 'production', 'sarscov2'
   TERRA_WORKSPACE=acceptance-tests  # Or 'integration_tests'
   TERRA_EMAIL=your_email@example.com
   TERRA_PASSWORD=your_password
   ```

   **For external Galaxy testing:**
   ```bash
   TERRA_URL=http://<IP_ADDRESS>:8000/galaxy/
   ```

3. **Authentication setup (Terra only):**
   To avoid Google captchas, run the authentication setup once:
   ```bash
   npx playwright test tests/auth.setup.ts --headed
   ```
   This saves your authenticated session to `.auth/user.json`, which is automatically reused by all subsequent tests.

### Running tests

**Test an external Galaxy instance:**
```bash
TERRA_URL=http://35.196.87.134:8000/galaxy/ npx playwright test history paste fastp
```

**Test against Terra (full lifecycle):**
```bash
npx playwright test login launch    # Launch Galaxy on Terra
npx playwright test history paste fastp  # Run Galaxy functional tests
npx playwright test shutdown        # Clean up
```

**Run all tests:**
```bash
npx playwright test
```

**Run specific test file:**
```bash
npx playwright test tests/fastp.spec.ts
```

**Debug tests (headed mode with inspector):**
```bash
npx playwright test tests/fastp.spec.ts --debug
```

**Run with visible browser:**
```bash
npx playwright test --headed
```

