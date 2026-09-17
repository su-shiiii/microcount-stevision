// ======================================
// MicroCount STEVision
// Researcher Dashboard
// ======================================

const loginCard =
    document.getElementById("loginCard");

const dashboard =
    document.getElementById("dashboard");

const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");

const submissionsBody =
    document.getElementById("submissionsBody");

const submissionCount =
    document.getElementById("submissionCount");

const highRiskCount =
    document.getElementById("highRiskCount");


// ======================================
// LOGIN
// ======================================

loginButton.addEventListener(
    "click",
    async function () {

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        if (!email || !password) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;
        }


        loginMessage.textContent =
            "Signing in...";


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            console.error(error);

            loginMessage.textContent =
                "Sign-in failed. Check your email and password.";

            return;
        }


        loginMessage.textContent = "";

        showDashboard();

    }
);


// ======================================
// SHOW DASHBOARD
// ======================================

async function showDashboard() {

    loginCard.style.display =
        "none";

    dashboard.style.display =
        "block";

    await loadSubmissions();

}


// ======================================
// LOAD SUBMISSIONS
// ======================================

async function loadSubmissions() {

    submissionsBody.innerHTML = `
        <tr>
            <td colspan="8">
                Loading submissions...
            </td>
        </tr>
    `;


    const { data, error } =
        await supabaseClient
            .from("submissions")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        submissionsBody.innerHTML = `
            <tr>
                <td colspan="8">
                    Unable to load submissions.
                </td>
            </tr>
        `;

        return;
    }


    submissionCount.textContent =
        data.length;


    const highRisk =
        data.filter(
            submission =>
                submission.risk_level === "LEVEL 3" ||
                submission.risk_level === "LEVEL 4"
        ).length;


    highRiskCount.textContent =
        highRisk;


    submissionsBody.innerHTML =
        "";


    data.forEach(function (submission) {

        const row =
            document.createElement("tr");


        const date =
            submission.created_at
                ? new Date(
                    submission.created_at
                ).toLocaleDateString()
                : "—";


        row.innerHTML = `

            <td>
                ${date}
            </td>

            <td>
                ${escapeHTML(
                    submission.sample_id || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    submission.school_name || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    submission.source || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    submission.water_condition || "—"
                )}
            </td>

            <td>
                ${submission.days_stored ?? 0}
            </td>

            <td>
                ${submission.particles ?? 0}
            </td>

            <td class="risk-level">
                ${escapeHTML(
                    submission.risk_level || "—"
                )}
            </td>

        `;


        submissionsBody.appendChild(
            row
        );

    });

}


// ======================================
// ESCAPE HTML
// ======================================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ======================================
// LOGOUT
// ======================================

logoutButton.addEventListener(
    "click",
    async function () {

        await supabaseClient.auth.signOut();

        dashboard.style.display =
            "none";

        loginCard.style.display =
            "block";

        loginEmail.value = "";

        loginPassword.value = "";

    }
);


// ======================================
// CHECK EXISTING SESSION
// ======================================

(async function () {

    const { data } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        showDashboard();

    }

})();