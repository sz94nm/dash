<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Users Table</h3>

            <div class="card-tools">
              <button class="btn btn-success" @click="insertModal()">
                Add User
                <i class="fas fa-user-plus fa-fw"></i>
              </button>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{user.id}}</td>
                  <td>{{user.name}}</td>
                  <td>{{user.email}}</td>
                  <td>{{user.role}}</td>
                  <td>
                    <a href="#" @click="editModal(user)">
                      <i class="fa fa-edit"></i>
                    </a>
                    <span>/</span>
                    <a href="#" @click="deleteUser(user.id)">
                      <i class="fa fa-trash red"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
        </div>
        <!-- /.card -->
      </div>
    </div>
    <!-- user info modal  -->
    <div
      class="modal fade"
      id="userInfoModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="userInfoModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="editMode" class="modal-title" id="userInfoModalLabel">Update User</h5>
            <h5 v-show="!editMode" class="modal-title" id="userInfoModalLabel">Add New User</h5>

            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="editMode?editUser(user.id):createUser">
            <div class="modal-body">
              <div class="form-group">
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.email"
                  type="email"
                  email="name"
                  placeholder="Email"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('password') }"
                />
                <has-error :form="form" field="password"></has-error>
              </div>
              <div class="form-group">
                <input
                  v-model="form.phone"
                  type="number"
                  name="phone"
                  placeholder="Phone Number"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('phone') }"
                />
                <has-error :form="form" field="phone"></has-error>
              </div>
              <div class="form-group">
                <select
                  name="role"
                  v-model="form.role"
                  id="role"
                  class="form-control"
                  :class="{'is-invalid':form.errors.has('role')}"
                >
                  <option value>Select User Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                </select>
                <has-error :form="form" field="role"></has-error>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
              <button v-show="editMode" type="submit" class="btn btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- /. user infomodal  -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      editMode: false,
      users: {},
      form: new Form({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        image: ""
      })
    };
  },
  created() {
    console.log("Component mounted.");
    this.fetchUsers();
    myEvent.$on("refreshUsers", () => {
      this.fetchUsers();
    });
  },
  methods: {
    editModal(user) {
      this.editMode = true;
      $("#userInfoModal").modal("show");
      this.form.fill(user);
    },
    insertModal() {
      this.editMode = false;
      this.form.reset();
      $("#userInfoModal").modal("show");
    },
    // fetch users
    fetchUsers() {
      axios.get("api/user").then(({ data }) => (this.users = data.data));
    },
    //==========================================

    // delete user
    deleteUser(id) {
      swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.form
              .delete("api/user/" + id)
              .then(() => {
                myEvent.$emit("resfreshUsers");
                toast.fire({
                  icon: "success",
                  title: "User deleted successfully"
                });
              })
              .catch(() => {});
          }
        });
    },
    //==========================================

    // create user
    createUser() {
      editMode = false;
      this.form
        .post("api/user")
        .then(() => {
          $("#userInfoModal").modal("hide");
          myEvent.$emit("resfreshUsers");
          toast.fire({
            icon: "success",
            title: "User created successfully"
          });
        })
        .catch(() => {});
      //===================================
    },

    //edit user
    editUser(id) {
      editMode = true;
      this.form
        .put("api/user/"+id)
        .then(() => {
          $("#userInfoModal").modal("hide");
          myEvent.$emit("resfreshUsers");
          toast.fire({
            icon: "success",
            title: "User Updated successfully"
          });
        })
        .catch(() => {});
      //===================================
    }
  }
};
</script>
