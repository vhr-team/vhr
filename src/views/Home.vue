<template>
    <div class="layout">
        <Layout :style="{minHeight: '100vh'}">
            <!-- 左侧侧边栏 -->
            <Sider class="iview-ui-sider" ref="side1" hide-trigger collapsible :collapsed-width="78"
                   v-model="isCollapsed">

                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo">
                        微人事
                    </div>
                </Menu>

                <Menu active-name="home"
                      :open-names="['home']"
                      width="auto"
                      :class="menuitemClasses"
                      accordion
                >
                    <template v-for="(item, componentIndex) in routes">

                        <!-- 展开并且有子菜单 -->
                        <Submenu v-if="!isCollapsed && item.children.length" v-bind:key="componentIndex"
                                 :name="componentIndex">
                            <template slot="title">
                                <!-- 图标 -->
                                <Icon :type="item.icon"/>
                                <!-- 菜单名称 -->
                                <span>{{ item.name }}</span>
                            </template>
                            <!-- 子菜单 -->
                            <MenuItem v-for="(children, index) in item.children"
                                      :key="index"
                                      :name="children.path"
                                      :to="children.path"
                            >
                                <!-- 子菜单图标 -->
                                <Icon :type="children.icon"/>
                                <!-- 子菜单名称 -->
                                {{ children.name }}
                            </MenuItem>
                        </Submenu>

                        <!-- 展开但没有子菜单 -->
                        <MenuItem v-else-if="!isCollapsed" :name="item.to" :to="item.path" v-bind:key="componentIndex">
                            <Icon :type="item.icon"/>
                            <span>{{ item.name }}</span>
                        </MenuItem>

                        <!-- 不展开有子菜单 -->
                        <Dropdown v-else-if="isCollapsed && item.children.length" v-bind:key="componentIndex"
                                  placement="right-start" class="menu-dropdown">
                            <MenuItem :name="item.path" :to="item.path">
                                <Icon :type="item.icon"/>
                                <span>{{ item.name }}</span>
                            </MenuItem>
                            <DropdownMenu slot="list">
                                <DropdownItem v-for="(children, index) in item.children" :key="index"
                                              style="padding: 0 0; background-color:#515a6e;">
                                    <MenuItem :name="children.path" :to="children.path">
                                        <Icon :type="children.icon"/>
                                        {{ children.name }}
                                    </MenuItem>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <!-- 不展开无子菜单 -->
                        <Tooltip v-else-if="isCollapsed" :content="item.name" placement="right"
                                 v-bind:key="componentIndex">
                            <MenuItem :name="item.path" :to="item.path">
                                <Icon :type="item.icon"/>
                                <span>{{ item.name }}</span>
                            </MenuItem>
                        </Tooltip>
                    </template>
                </Menu>
            </Sider>

            <Layout>
                <!-- 右侧头部区域-->
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu"
                          size="24"></Icon>

                    <el-link icon="ivu-icon ivu-icon-md-home" href="#/home" :underline="false"> 首 页</el-link>

                    <el-dropdown class="UserDropMenu" @command="commandandler">
                      <span class="el-dropdown-link">
                        {{user.name}}
                          <i class="el-icon-arrow-down el-icon--right">
                            <Avatar style="margin-left: 10px;" :src="user.userface"/>
                          </i>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                            <el-dropdown-item command="setting">设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </Header>

                <!-- 右侧内容区域 -->
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                    <router-view/>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                isCollapsed: false,
                keepAliveList: [],
                title: "Home",
                showSettingPage: false,
                showSuggestionPage: false,
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed: {
            rotateIcon() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },
            routes() {
                return this.$store.state.routes;
            }
        },
        methods: {
            collapsedSider() {
                this.$refs.side1.toggleCollapse();
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            commandandler(cmd) {
                if (cmd == 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest("/permission/logout");
                        window.sessionStorage.removeItem("user");
                        this.$store.commit("initRoutes", []);

                        /* 注销了，重新跳转回登录*/
                        this.$router.replace("/");
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }
            }
        }
    }
</script>

<style scoped>

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }

    .UserDropMenu {
        position: absolute;
        right: 30px;
    }

    .ivu-menu-dark {
        background: #001529;
    }

    .layout-logo {
        height: 30px;
        border-radius: 3px;
        position: relative;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        line-height: 30px;
        color: #ffffff;
        font-size: 25px;
        font-family: 华文行楷;
        text-align: center;
    }

    .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {
        background: #000c17 !important;
    }

    .ivu-dropdown-item {
        background: #fff;
        color: #b3b9ac !important;
    }

    .ivu-menu-light, .ivu-menu-vertical, .ivu-menu-item-active:not(.ivu-menu-submenu) {
        color: #b3b9ac !important;
        background: none !important;
        z-index: 2;
    }

    .ivu-menu-item:hover {
        color: #fff !important;
    }

    .ivu-menu-vertical {
        color: #b3b9ac !important;
    }

    .ivu-menu-submenu-title:hover {
        color: #fff !important;
    }

    .ivu-menu-vertical .ivu-menu-submenu-title:hover {
        color: #fff;
    }


    .ivu-menu-light {
        background: #000c17;
    }

    .iview-ui-sider {
        background: #001529;
    }

    .layout {
        position: relative;
        overflow: hidden;
    }

    .layout-header-bar {
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    }

    .layout-logo-left {
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }

    .menu-icon {
        transition: all .3s;
    }

    .rotate-icon {
        transform: rotate(-90deg);
    }

    .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }

    .menu-item i {
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu span {
        width: 0px;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>
