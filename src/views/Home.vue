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
                <!-- 头部区域-->
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon"
                          :style="{margin: '0 20px',cursor: 'pointer'}" type="md-menu"
                          size="24"></Icon>

                    <Dropdown class="UserDropMenu" @on-click="changeMenu">
                        <a href="javascript:void(0)">
                            {{user.name}}
                            <Icon type="ios-arrow-down"></Icon>
                            <!-- 用户头像 -->
                            <Avatar style="margin-left: 10px;margin-top: -5px;" :src="user.userface"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="userinfo"> 个人中心</DropdownItem>
                            <DropdownItem name="setting"> 设置</DropdownItem>
                            <DropdownItem name="logout" divided> 退出</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <!-- 面包屑导航 -->
                    <Breadcrumb :style="{display: 'inline-block'}">
                        <BreadcrumbItem to="/home">
                            <Icon type="ivu-icon ivu-icon-md-home"></Icon>
                            首 页
                        </BreadcrumbItem>
                        <BreadcrumbItem to="/components/breadcrumb">
                            <Icon type="logo-buffer"></Icon>
                            Components
                        </BreadcrumbItem>
                    </Breadcrumb>
                </Header>
                <!-- 右侧内容区域 -->
                <Content :style="{margin: '20px', background: '#fff'}">
                    <router-view/>
                </Content>

                <Footer class="layout-footer-center">Copyright © 2020 Vhr. All Rights Reserved.</Footer>
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
            changeMenu(name) {
                if (name == 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest("/permission/logout");
                        window.sessionStorage.removeItem("user");
                        /* 用户注销了，菜单数据清空 */
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
            },
            collapsedSider() {
                this.$refs.side1.toggleCollapse();
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
        },
    }
</script>

<style>
    .ivu-dropdown-item {
        color: #515a6e !important;
    }

    /* 版权信息的样式 */
    .layout-footer-center {
        height: 0px;
        line-height: 0px;
        text-align: center;
        margin-top: -10px;
    }

    /* 用户信息的样式【头部】右侧*/
    .UserDropMenu {
        position: absolute;
        right: 30px;
    }

    /* 菜单背景样式 */
    .ivu-menu-dark {
        background: #001529 !important;
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
        background: #001529 !important;
    }

    .ivu-dropdown-item:hover {
        background: none;
    }

    /* 系统的样式 */
    .layout-header-bar {
        background: #fff !important;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
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
